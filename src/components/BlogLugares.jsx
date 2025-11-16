import { useState, useEffect } from 'react'

export default function BlogLugares({ lugares, setLugares, onCerrar, onActualizarImagenes }) {
  const [modoEdicion, setModoEdicion] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [lugarForm, setLugarForm] = useState({
    titulo: '',
    descripcion: '',
    ubicacion: '',
    contenido: '',
    categoria: 'trekking',
    destacado: false,
    imagenes: ['', '', '']
  })

  const categorias = [
    { value: 'trekking', label: 'Trekking' },
    { value: 'camping', label: 'Camping' },
    { value: 'escalada', label: 'Escalada' },
    { value: 'naturaleza', label: 'Naturaleza' },
    { value: 'aventura', label: 'Aventura' },
    { value: 'cultura', label: 'Cultura' }
  ]

  const agregarLugar = async () => {
    if (!lugarForm.titulo || !lugarForm.descripcion) {
      alert('Por favor completa título y descripción')
      return
    }

    const nuevoLugar = {
      id: Date.now(),
      ...lugarForm,
      fechaPublicacion: new Date().toISOString()
    }

    try {
      const response = await fetch('http://localhost:8000/api/lugares.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([...lugares, nuevoLugar])
      })

      if (!response.ok) throw new Error('Error al guardar')

      setLugares([...lugares, nuevoLugar])
      resetForm()
      alert('✅ Lugar agregado exitosamente')
    } catch (error) {
      console.error('Error:', error)
      alert('❌ Error al guardar el lugar')
    }
  }

  const editarLugar = (lugar) => {
    setModoEdicion(lugar.id)
    setLugarForm({
      titulo: lugar.titulo,
      descripcion: lugar.descripcion,
      ubicacion: lugar.ubicacion || '',
      contenido: lugar.contenido || '',
      categoria: lugar.categoria || 'trekking',
      destacado: lugar.destacado || false,
      imagenes: [...lugar.imagenes]
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const guardarEdicion = async () => {
    const lugaresActualizados = lugares.map(lugar =>
      lugar.id === modoEdicion
        ? { ...lugar, ...lugarForm }
        : lugar
    )

    try {
      const response = await fetch('http://localhost:8000/api/lugares.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lugaresActualizados)
      })

      if (!response.ok) throw new Error('Error al actualizar')

      setLugares(lugaresActualizados)
      if (onActualizarImagenes) onActualizarImagenes()
      resetForm()
      alert('✅ Lugar actualizado exitosamente')
    } catch (error) {
      console.error('Error:', error)
      alert('❌ Error al actualizar el lugar')
    }
  }

  const eliminarLugar = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este lugar?')) return

    const lugaresActualizados = lugares.filter(lugar => lugar.id !== id)

    try {
      const response = await fetch('http://localhost:8000/api/lugares.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lugaresActualizados)
      })

      if (!response.ok) throw new Error('Error al eliminar')

      setLugares(lugaresActualizados)
      alert('✅ Lugar eliminado')
    } catch (error) {
      console.error('Error:', error)
      alert('❌ Error al eliminar el lugar')
    }
  }

  const resetForm = () => {
    setModoEdicion(null)
    setLugarForm({
      titulo: '',
      descripcion: '',
      ubicacion: '',
      contenido: '',
      categoria: 'trekking',
      destacado: false,
      imagenes: ['', '', '']
    })
  }

  const handleImagenFile = async (index, file) => {
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      alert('⚠️ El archivo debe ser menor a 2MB')
      return
    }

    const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!tiposPermitidos.includes(file.type)) {
      alert('⚠️ Solo se permiten archivos JPG, PNG o WEBP')
      return
    }

    setGuardando(true)
    const formData = new FormData()
    formData.append('image', file)

    try {
      const response = await fetch('http://localhost:8000/api/upload-image.php', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        const nuevasImagenes = [...lugarForm.imagenes]
        nuevasImagenes[index] = data.url
        setLugarForm({ ...lugarForm, imagenes: nuevasImagenes })
      } else {
        alert('❌ Error al subir imagen: ' + (data.error || 'Error desconocido'))
      }
    } catch (error) {
      alert('❌ Error al subir la imagen')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>📍 Gestor de Lugares / Blog</h2>
        <button onClick={onCerrar} className="btn-cerrar">✖</button>
      </div>

      <div className="admin-content">
        {/* FORMULARIO */}
        <div className="formulario-actividad">
          <h3>{modoEdicion ? '✏️ Editar Lugar' : '➕ Agregar Nuevo Lugar'}</h3>

          {modoEdicion && (
            <div className="alert alert-info">
              📝 Modo Edición: ID = {modoEdicion}
            </div>
          )}

          <div className="form-group">
            <label>Título del Lugar *</label>
            <input
              type="text"
              className="form-control"
              value={lugarForm.titulo}
              onChange={(e) => setLugarForm({ ...lugarForm, titulo: e.target.value })}
              placeholder="Ej: Parque Nacional Nahuelbuta"
            />
          </div>

          <div className="form-group">
            <label>Descripción Corta *</label>
            <input
              type="text"
              className="form-control"
              value={lugarForm.descripcion}
              onChange={(e) => setLugarForm({ ...lugarForm, descripcion: e.target.value })}
              placeholder="Breve descripción (1-2 líneas)"
            />
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>Ubicación</label>
                <input
                  type="text"
                  className="form-control"
                  value={lugarForm.ubicacion}
                  onChange={(e) => setLugarForm({ ...lugarForm, ubicacion: e.target.value })}
                  placeholder="Ej: Región de La Araucanía"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Categoría</label>
                <select
                  className="form-control"
                  value={lugarForm.categoria}
                  onChange={(e) => setLugarForm({ ...lugarForm, categoria: e.target.value })}
                >
                  {categorias.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Contenido Completo (Blog)</label>
            <textarea
              className="form-control"
              rows="8"
              value={lugarForm.contenido}
              onChange={(e) => setLugarForm({ ...lugarForm, contenido: e.target.value })}
              placeholder="Escribe aquí el contenido completo del artículo del blog..."
            />
          </div>

          <div className="form-check mb-3">
            <input
              type="checkbox"
              className="form-check-input"
              id="destacado"
              checked={lugarForm.destacado}
              onChange={(e) => setLugarForm({ ...lugarForm, destacado: e.target.checked })}
            />
            <label className="form-check-label" htmlFor="destacado">
              ⭐ Marcar como Destacado
            </label>
          </div>

          {/* IMÁGENES */}
          <div className="imagenes-section">
            <h4>📷 Imágenes</h4>
            <div className="row">
              {[0, 1, 2].map(index => (
                <div key={index} className="col-md-4 mb-3">
                  <label className="form-label">Imagen {index + 1}</label>
                  {lugarForm.imagenes[index] && (
                    <div className="imagen-preview">
                      <img
                        src={lugarForm.imagenes[index]}
                        alt={`Preview ${index + 1}`}
                        style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    className="form-control mt-2"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={(e) => handleImagenFile(index, e.target.files[0])}
                    disabled={guardando}
                  />
                  <small className="text-muted">JPG, PNG o WEBP (máx 2MB)</small>
                </div>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button
              className="btn btn-primary btn-lg"
              onClick={modoEdicion ? guardarEdicion : agregarLugar}
              disabled={guardando}
            >
              {guardando ? '⏳ Subiendo...' : (modoEdicion ? '💾 Guardar Cambios' : '➕ Agregar Lugar')}
            </button>
            {modoEdicion && (
              <button className="btn btn-secondary btn-lg ms-2" onClick={resetForm}>
                ❌ Cancelar
              </button>
            )}
          </div>
        </div>

        {/* LISTA DE LUGARES */}
        <div className="lista-actividades mt-5">
          <h3>📋 Lugares Publicados ({lugares.length})</h3>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Título</th>
                  <th>Categoría</th>
                  <th>Ubicación</th>
                  <th>Destacado</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {lugares.map(lugar => (
                  <tr key={lugar.id}>
                    <td>{lugar.id}</td>
                    <td>
                      <strong>{lugar.titulo}</strong>
                      <br />
                      <small className="text-muted">{lugar.descripcion}</small>
                    </td>
                    <td>
                      <span className="badge bg-info">{lugar.categoria}</span>
                    </td>
                    <td>{lugar.ubicacion || '-'}</td>
                    <td>{lugar.destacado ? '⭐' : '-'}</td>
                    <td>
                      {lugar.fechaPublicacion
                        ? new Date(lugar.fechaPublicacion).toLocaleDateString()
                        : '-'}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => editarLugar(lugar)}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => eliminarLugar(lugar.id)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
