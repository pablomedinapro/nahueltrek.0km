import './App.css'
import logo from './assets/logo.png'
import { useState } from 'react'

function App() {
  // Datos de ejemplo para las próximas actividades
  const [actividades] = useState([
    {
      id: 1,
      fecha: '2025-11-15',
      titulo: 'Trekking Cerro Campanario',
      descripcion: 'Caminata de 4 horas con vista panorámica',
      dificultad: 'Media',
      cupos: 12
    },
    {
      id: 2,
      fecha: '2025-11-22',
      titulo: 'Expedición Laguna Azul',
      descripcion: 'Travesía de día completo por paisajes únicos',
      dificultad: 'Alta',
      cupos: 8
    },
    {
      id: 3,
      fecha: '2025-11-30',
      titulo: 'Sendero Bosque Nativo',
      descripcion: 'Caminata interpretativa de flora y fauna',
      dificultad: 'Baja',
      cupos: 15
    },
    {
      id: 4,
      fecha: '2025-12-06',
      titulo: 'Trekking Refugio Frey',
      descripcion: 'Ascenso al refugio con camping nocturno',
      dificultad: 'Alta',
      cupos: 10
    }
  ])

  const formatearFecha = (fecha) => {
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES', opciones)
  }

  const getDificultadColor = (dificultad) => {
    switch(dificultad) {
      case 'Baja': return '#4caf50'
      case 'Media': return '#ff9800'
      case 'Alta': return '#f44336'
      default: return '#757575'
    }
  }

  return (
    <div className="App">
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: '#1e3a5f',
        color: 'white'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img src={logo} alt="Nahuel Trek Logo" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
          <h2 style={{ margin: 0 }}>Nahueltrek</h2>
        </div>
        <ul style={{
          display: 'flex',
          listStyle: 'none',
          gap: '2rem',
          margin: 0,
          padding: 0
        }}>
          <li><a href="#inicio" style={{ color: 'white', textDecoration: 'none' }}>Inicio</a></li>
          <li><a href="#servicios" style={{ color: 'white', textDecoration: 'none' }}>Servicios</a></li>
          <li><a href="#sobre-nosotros" style={{ color: 'white', textDecoration: 'none' }}>Sobre Nosotros</a></li>
          <li><a href="#contacto" style={{ color: 'white', textDecoration: 'none' }}>Contacto</a></li>
        </ul>
      </nav>
      
      <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
        <img src={logo} alt="Nahuel Trek Logo" style={{ width: '200px', marginBottom: '20px' }} />
        <h1>Bienvenido a Nahueltrek</h1>
        <p>Tu aventura comienza aquí</p>
      </div>

      {/* Sección de Calendario de Actividades */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto 3rem auto',
        padding: '2rem',
      }}>
        <h2 style={{ textAlign: 'center', color: '#1e3a5f', marginBottom: '2rem' }}>
          📅 Próximas Actividades
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {actividades.map((actividad) => (
            <div key={actividad.id} style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              transition: 'transform 0.3s ease',
              cursor: 'pointer',
              border: '2px solid #e0e0e0'
            }}>
              <div style={{
                backgroundColor: '#1e3a5f',
                color: 'white',
                padding: '1rem',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                  {formatearFecha(actividad.fecha)}
                </div>
              </div>
              
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ 
                  color: '#1e3a5f', 
                  marginBottom: '0.5rem',
                  fontSize: '1.3rem'
                }}>
                  {actividad.titulo}
                </h3>
                
                <p style={{ 
                  color: '#666', 
                  marginBottom: '1rem',
                  lineHeight: '1.6'
                }}>
                  {actividad.descripcion}
                </p>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid #e0e0e0'
                }}>
                  <div>
                    <span style={{
                      backgroundColor: getDificultadColor(actividad.dificultad),
                      color: 'white',
                      padding: '0.3rem 0.8rem',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: 'bold'
                    }}>
                      {actividad.dificultad}
                    </span>
                  </div>
                  
                  <div style={{ 
                    color: '#666',
                    fontSize: '0.9rem'
                  }}>
                    👥 {actividad.cupos} cupos
                  </div>
                </div>
                
                <button style={{
                  width: '100%',
                  marginTop: '1rem',
                  padding: '0.8rem',
                  backgroundColor: '#1e3a5f',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#2c5282'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#1e3a5f'}
                >
                  Reservar
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sección NDR */}
      <section style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '2rem',
        textAlign: 'left',
        backgroundColor: '#f5f5f5',
        borderRadius: '10px'
      }}>
        <h2 style={{ textAlign: 'center', color: '#1e3a5f', marginBottom: '1.5rem' }}>
          🏕️ Los 7 Principios de "No Deje Rastro" (NDR)
        </h2>
        <p style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.1rem' }}>
          El programa No Deje Rastro (Leave No Trace) ofrece una guía sencilla para minimizar nuestro impacto en los ambientes naturales. Aplicar estos principios es esencial para la conservación y el disfrute de la naturaleza por todos.
        </p>

        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#1e3a5f', marginBottom: '1rem' }}>1. Planifique y prepare su viaje con anticipación.</h3>
            <ul style={{ lineHeight: '1.8' }}>
              <li>Investigue el área y las regulaciones locales.</li>
              <li>Lleve el equipo adecuado para el clima y el terreno.</li>
              <li>Reempaque los alimentos para reducir la basura y lleve bolsas para recoger todos sus desechos.</li>
            </ul>
          </div>

          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#1e3a5f', marginBottom: '1rem' }}>2. Viaje y acampe sobre superficies durables.</h3>
            <ul style={{ lineHeight: '1.8' }}>
              <li>Use siempre los senderos y sitios de campamento ya establecidos.</li>
              <li>Evite caminar o acampar en vegetación frágil o áreas sensibles como praderas alpinas.</li>
              <li>Mantenga los sitios de acampada pequeños para minimizar el impacto.</li>
            </ul>
          </div>

          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#1e3a5f', marginBottom: '1rem' }}>3. Disponga de los desechos de la manera más apropiada.</h3>
            <ul style={{ lineHeight: '1.8' }}>
              <li>Empaque toda su basura (incluyendo restos de comida, cáscaras y papel higiénico) y llévela de vuelta.</li>
              <li>Deposite los desechos humanos a 60-70 metros (200 pies) de fuentes de agua, senderos o campamentos, cavando un "hoyo de gato" de 15-20 cm de profundidad.</li>
              <li>Lave platos y asee su cuerpo a 60 metros de distancia de fuentes de agua.</li>
            </ul>
          </div>

          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#1e3a5f', marginBottom: '1rem' }}>4. Deje lo que encuentre.</h3>
            <ul style={{ lineHeight: '1.8' }}>
              <li>No recoja ni se lleve objetos naturales o culturales (rocas, plantas, artefactos, conchas).</li>
              <li>Evite construir estructuras, cavar zanjas o alterar el sitio de cualquier forma.</li>
              <li>Deje los objetos naturales y el entorno tal como los encontró.</li>
            </ul>
          </div>

          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#1e3a5f', marginBottom: '1rem' }}>5. Minimice el impacto de las fogatas.</h3>
            <ul style={{ lineHeight: '1.8' }}>
              <li>Considere usar una cocinilla o estufa de campamento para cocinar.</li>
              <li>Si hace fuego, use los anillos o áreas designadas para fogatas.</li>
              <li>Mantenga las fogatas pequeñas y use solo leña caída y muerta del suelo. Nunca corte árboles vivos.</li>
            </ul>
          </div>

          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#1e3a5f', marginBottom: '1rem' }}>6. Respete la vida silvestre.</h3>
            <ul style={{ lineHeight: '1.8' }}>
              <li>Observe a los animales desde una distancia segura.</li>
              <li>Nunca alimente a los animales, ya que esto daña su salud y altera su comportamiento natural.</li>
              <li>Guarde la comida y la basura de manera segura para evitar atraer a la fauna.</li>
            </ul>
          </div>

          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#1e3a5f', marginBottom: '1rem' }}>7. Sea considerado con otros visitantes.</h3>
            <ul style={{ lineHeight: '1.8' }}>
              <li>Ceda el paso en los senderos y sea cortés.</li>
              <li>Evite el ruido excesivo para permitir que otros disfruten de los sonidos de la naturaleza.</li>
              <li>Mantenga a sus mascotas bajo control o evite llevarlas si no están permitidas.</li>
            </ul>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '1.2rem', fontWeight: 'bold', color: '#1e3a5f' }}>
          Protejamos y disfrutemos juntos de nuestro mundo natural.
        </p>
      </section>
    </div>
  )
}

export default App
