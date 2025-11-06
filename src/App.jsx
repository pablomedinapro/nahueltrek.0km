import './App.css'
import logo from './assets/logo.png'

function App() {
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
    </div>
  )
}

export default App
