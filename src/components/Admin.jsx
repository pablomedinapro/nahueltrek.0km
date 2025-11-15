import { useState } from 'react'
import '../App.css'

function Admin({ actividades, setActividades, onCerrar, onResetear, onActualizarImagenes }) {
  const [modoEdicion, setModoEdicion] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [actividadForm, setActividadForm] = useState({
    fecha: '',
    titulo: '',
    descripcion: '',
    dificultad: 'Medio',
    precio: '',
    imagenes: ['', '', '']
  })

  const dificultades = ['Bajo', 'Medio', 'Medio - Alto', 'Alto']

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setActividadForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImagenChange = (index, value) => {
    const nuevasImagenes = [...actividadForm.imagenes]
    nuevasImagenes[index] = value
    setActividadForm(prev => ({
      ...prev,
      imagenes: nuevasImagenes
    }))
  }

  const handleImagenFile = async (index, file) => {
    if (!file) return

    setGuardando(true) // Indicador de carga

    // Validaciones
    const maxSize = 2 * 1024 * 1024 // 2MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    
    // Validar tipo de archivo
    if (!allowedTypes.includes(file.type)) {
      setGuardando(false)
      alert('❌ Formato no permitido\n\nFormatos aceptados: JPG, JPEG, PNG, WEBP')
      return
    }

    // Validar tamaño
    if (file.size > maxSize) {
      setGuardando(false)
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2)
      alert(`❌ Archivo muy grande (${sizeMB}MB)\n\nTamaño máximo: 2MB\n\nTip: Comprime la imagen en https://tinypng.com`)
      return
    }

    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/upload-image.php', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: `Error ${response.status}` }))
        throw new Error(error.error || `Error ${response.status}`)
      }

      const data = await response.json()

      if (!data.success || !data.url) {
        throw new Error('Respuesta sin URL válida')
      }
      
      const nuevasImagenes = [...actividadForm.imagenes]
      nuevasImagenes[index] = data.url
      
      setActividadForm(prev => ({
        ...prev,
        imagenes: nuevasImagenes
      }))

      setGuardando(false)
      const sizeKB = (file.size / 1024).toFixed(0)
      alert(`✅ Imagen ${index + 1} subida\n\n${file.name} (${sizeKB}KB)\n\n${modoEdicion ? '💡 Haz clic en "Guardar Cambios" para aplicar' : '⚠️ Recuerda hacer clic en "Agregar Actividad"'}`)
    } catch (error) {
      setGuardando(false)
      alert(`❌ Error al subir imagen\n\n${error.message}`)
    }
  }

  const agregarActividad = () => {
    if (!actividadForm.titulo || !actividadForm.fecha || !actividadForm.precio) {
      alert('Por favor completa título, fecha y precio')
      return
    }

    const nuevaActividad = {
      id: Date.now(),
      ...actividadForm,
      imagenes: actividadForm.imagenes.filter(img => img.trim() !== '')
    }

    setActividades([...actividades, nuevaActividad])
    
    // Actualizar versión de imágenes solo cuando agregamos
    if (onActualizarImagenes) {
      onActualizarImagenes()
    }
    
    resetForm()
    alert('Actividad agregada exitosamente')
  }

  const eliminarImagen = (actividadId, imagenIndex) => {
    if (window.confirm('¿Eliminar esta imagen?')) {
      const actividadesActualizadas = actividades.map(act => {
        if (act.id === actividadId) {
          const nuevasImagenes = act.imagenes.filter((_, idx) => idx !== imagenIndex)
          return { ...act, imagenes: nuevasImagenes }
        }
        return act
      })
      setActividades(actividadesActualizadas)
      if (onActualizarImagenes) {
        onActualizarImagenes()
      }
    }
  }

  const editarActividad = (actividad) => {
    setModoEdicion(actividad.id)
    setActividadForm({
      fecha: actividad.fecha,
      titulo: actividad.titulo,
      descripcion: actividad.descripcion,
      dificultad: actividad.dificultad,
      precio: actividad.precio,
      imagenes: [...actividad.imagenes, '', '', ''].slice(0, 3)
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const guardarEdicion = () => {
    if (!actividadForm.titulo || !actividadForm.fecha || !actividadForm.precio) {
      alert('Por favor completa título, fecha y precio')
      return
    }

    const actividadesActualizadas = actividades.map(act => 
      act.id === modoEdicion 
        ? { 
            ...act, 
            ...actividadForm,
            imagenes: actividadForm.imagenes.filter(img => img.trim() !== '')
          }
        : act
    )
    
    setActividades(actividadesActualizadas)
    
    if (onActualizarImagenes) {
      onActualizarImagenes()
    }
    
    resetForm()
    alert('✅ Actividad actualizada exitosamente')
  }

  const eliminarActividad = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta actividad?')) {
      setActividades(actividades.filter(act => act.id !== id))
    }
  }

  const resetForm = () => {
    setModoEdicion(null)
    setActividadForm({
      fecha: '',
      titulo: '',
      descripcion: '',
      dificultad: 'Medio',
      precio: '',
      imagenes: ['', '', '']
    })
  }

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 overflow-auto" style={{
      backgroundColor: 'rgba(0,0,0,0.8)',
      zIndex: 2000,
      padding: 'clamp(1rem, 3vw, 2rem)'
    }}>
      <div className="container" style={{
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: 'clamp(1rem, 3vw, 2rem)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 pb-3" style={{
          borderBottom: '2px solid #e0e0e0',
          gap: '1rem'
        }}>
          <h2 className="text-center text-md-start" style={{ 
            color: '#1e3a5f', 
            margin: 0,
            fontSize: 'clamp(1.5rem, 4vw, 2rem)'
          }}>
            🔧 Panel de Administración
          </h2>
          <div className="d-flex gap-2 flex-wrap justify-content-center">
            <button
              onClick={onResetear}
              className="btn btn-warning fw-bold"
              style={{
                fontSize: 'clamp(0.8rem, 2vw, 1rem)',
                padding: 'clamp(0.5rem, 2vw, 0.7rem) clamp(0.8rem, 3vw, 1.5rem)'
              }}
            >
              🔄 Resetear
            </button>
            <button
              onClick={onCerrar}
              className="btn btn-danger fw-bold"
              style={{
                fontSize: 'clamp(0.8rem, 2vw, 1rem)',
                padding: 'clamp(0.5rem, 2vw, 0.7rem) clamp(0.8rem, 3vw, 1.5rem)'
              }}
            >
              ✕ Cerrar
            </button>
          </div>
          
          {/* Indicador de guardado */}
          {guardando && (
            <div className="alert alert-info mt-3" style={{ fontSize: '0.9rem' }}>
              ⏳ <strong>Guardando imagen...</strong> Por favor espera
            </div>
          )}
        </div>

        {/* Formulario */}
        <div className="bg-light rounded-3 p-3 p-md-4 mb-4">
          <h3 className="mb-4" style={{ color: '#1e3a5f', fontSize: 'clamp(1.2rem, 3vw, 1.5rem)' }}>
            {modoEdicion ? '✏️ Editar Actividad' : '➕ Nueva Actividad'}
          </h3>
          
          {modoEdicion && (
            <div className="alert alert-info mb-3" style={{ fontSize: '0.9rem' }}>
              <strong>📝 Modo Edición:</strong> ID = {modoEdicion}
            </div>
          )}

          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label fw-bold" style={{ color: '#1e3a5f' }}>
                Fecha *
              </label>
              <input
                type="date"
                name="fecha"
                value={actividadForm.fecha}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label fw-bold" style={{ color: '#1e3a5f' }}>
                Dificultad *
              </label>
              <select
                name="dificultad"
                value={actividadForm.dificultad}
                onChange={handleInputChange}
                className="form-select"
              >
                {dificultades.map(dif => (
                  <option key={dif} value={dif}>{dif}</option>
                ))}
              </select>
            </div>

            <div className="col-12">
              <label className="form-label fw-bold" style={{ color: '#1e3a5f' }}>
                Título *
              </label>
              <input
                type="text"
                name="titulo"
                value={actividadForm.titulo}
                onChange={handleInputChange}
                placeholder="Ej: Trekking Volcán Sollipulli"
                className="form-control"
              />
            </div>

            <div className="col-12">
              <label className="form-label fw-bold" style={{ color: '#1e3a5f' }}>
                Descripción *
              </label>
              <input
                type="text"
                name="descripcion"
                value={actividadForm.descripcion}
                onChange={handleInputChange}
                placeholder="Ej: 21 km (ida-vuelta)"
                className="form-control"
              />
            </div>

            <div className="col-12">
              <label className="form-label fw-bold" style={{ color: '#1e3a5f' }}>
                Precio *
              </label>
              <input
                type="text"
                name="precio"
                value={actividadForm.precio}
                onChange={handleInputChange}
                placeholder="Ej: $50,000"
                className="form-control"
              />
            </div>

            <div className="col-12">
              <label className="form-label fw-bold mb-2" style={{ color: '#1e3a5f' }}>
                📷 Imágenes (mínimo 1, máximo 3)
              </label>
              
              {/* Restricciones claramente visibles */}
              <div className="alert alert-success mb-3" style={{ fontSize: '0.85rem', padding: '0.75rem' }}>
                <strong>✅ Las imágenes se suben al servidor automáticamente</strong>
                <ul className="mb-0 mt-2" style={{ paddingLeft: '1.2rem' }}>
                  <li><strong>Formatos:</strong> JPG, JPEG, PNG, WEBP</li>
                  <li><strong>Tamaño máximo:</strong> 2MB por imagen</li>
                  <li><strong>Almacenamiento:</strong> Persistente en el servidor</li>
                  <li><strong>Visible en:</strong> Todos los dispositivos</li>
                  <li><strong>Tip:</strong> Comprime en <a href="https://tinypng.com" target="_blank" rel="noopener">tinypng.com</a> antes de subir</li>
                </ul>
              </div>

              {[0, 1, 2].map(index => (
                <div key={index} className="mb-3 p-3 border rounded-3" style={{ backgroundColor: '#f8f9fa' }}>
                  <label className="form-label fw-semibold mb-2" style={{ fontSize: '0.95rem', color: '#1e3a5f' }}>
                    �️ Imagen {index + 1} {index === 0 && <span className="badge bg-danger ms-2">Requerida</span>}
                  </label>
                  
                  {/* Input de archivo */}
                  <div className="mb-2">
                    <label className="btn btn-primary btn-sm w-100" style={{ cursor: 'pointer' }}>
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={(e) => handleImagenFile(index, e.target.files[0])}
                        style={{ display: 'none' }}
                      />
                      📤 Subir al servidor (máx 2MB)
                    </label>
                  </div>
                  
                  {/* Separador */}
                  <div className="text-center text-muted my-2" style={{ fontSize: '0.85rem' }}>
                    — o —
                  </div>
                  
                  {/* Input de URL */}
                  <input
                    type="url"
                    value={actividadForm.imagenes[index]}
                    onChange={(e) => handleImagenChange(index, e.target.value)}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    className="form-control"
                  />
                  {actividadForm.imagenes[index] && (
                    <div className="mt-2">
                      <img
                        src={actividadForm.imagenes[index]}
                        alt={`Preview ${index + 1}`}
                        style={{ maxWidth: '120px', height: 'auto', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="d-flex flex-column flex-md-row gap-2 mt-4">
            <button
              onClick={modoEdicion ? guardarEdicion : agregarActividad}
              className="btn btn-success flex-fill"
              style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)', padding: 'clamp(0.6rem, 2vw, 0.8rem)' }}
            >
              {modoEdicion ? '💾 Guardar Cambios' : '➕ Agregar Actividad'}
            </button>
            <button
              onClick={resetForm}
              className="btn btn-secondary flex-fill"
              style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)', padding: 'clamp(0.6rem, 2vw, 0.8rem)' }}
            >
              🔄 {modoEdicion ? 'Cancelar Edición' : 'Limpiar'}
            </button>
          </div>
        </div>

        {/* Lista de Actividades */}
        <div>
          <h3 className="mb-4" style={{ color: '#1e3a5f', fontSize: 'clamp(1.2rem, 3vw, 1.5rem)' }}>
            📋 Actividades Registradas ({actividades.length})
          </h3>

          <div className="row row-cols-1 row-cols-md-2 g-3">
            {actividades.map(actividad => (
              <div key={actividad.id} className="col">
                <div className="card h-100 shadow-sm" style={{ borderRadius: '12px', border: '2px solid #e0e0e0', overflow: 'hidden' }}>
                  <img
                    src={actividad.imagenes[0]}
                    alt={actividad.titulo}
                    className="card-img-top"
                    style={{ height: '180px', objectFit: 'cover' }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title" style={{ color: '#1e3a5f', fontSize: 'clamp(1rem, 2.5vw, 1.15rem)', marginBottom: '0.8rem' }}>
                      {actividad.titulo}
                    </h5>
                    <p className="card-text mb-2" style={{ fontSize: '0.9rem' }}>
                      <strong>📅 Fecha:</strong> {new Date(actividad.fecha + 'T00:00:00').toLocaleDateString('es-CL')}
                    </p>
                    <p className="card-text mb-2" style={{ fontSize: '0.9rem' }}>
                      <strong>📍 Descripción:</strong> {actividad.descripcion}
                    </p>
                    <p className="card-text mb-2" style={{ fontSize: '0.9rem' }}>
                      <strong>🏔️ Dificultad:</strong> {' '}
                      <span className={`badge bg-${
                        actividad.dificultad === 'Bajo' ? 'success' : 
                        actividad.dificultad === 'Medio' ? 'warning' : 
                        actividad.dificultad === 'Medio - Alto' ? 'warning' : 
                        'danger'
                      }`}>
                        {actividad.dificultad}
                      </span>
                    </p>
                    <p className="card-text mb-3" style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#2d5a8f' }}>
                      <strong>💰 Precio:</strong> {actividad.precio}
                    </p>
                    <div className="d-flex gap-2 mt-auto">
                      <button
                        onClick={() => editarActividad(actividad)}
                        className="btn btn-primary btn-sm flex-fill"
                        style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => eliminarActividad(actividad.id)}
                        className="btn btn-danger btn-sm flex-fill"
                        style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin
