import {Route, Routes, } from 'react-router-dom'
import {useState} from 'react'
import Nav from './Nav'
import Logs from './pages/Logs'
import Store from './pages/Store'
import ResourcePage from './pages/ResourcePage'
import About from './pages/About'
import neutral from './assets/chip-neutral.png'
import happy from './assets/chip-happy.png'
import sad from './assets/chip-sad.png'
import background from './assets/mdflagbg.jpg'
import './App.css'

function App() {
  return (
    <div className="app-container" style={{ backgroundImage: `url(${background}` }}>
      <Nav />
      <div className="container">
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/store" element={<Store />} />
            <Route path="/resourcepage" element={<ResourcePage />} />
            <Route path="/about" element={<About />} />
        </Routes>
      </div>
      <Footer/>
    </div>
  )
}

function Home() {
  return (
    <div className='home-container'>
      <div className='user-level'>
      <span className="level-circle">1</span>
        <div className='progress-bar'>
          <span style={{width: '10%'}}></span>
        </div>
      </div>
      <div className='home-content'>
        <div className="challenges-box">
          <h2>Challenges</h2>
          <Checkbox />
        </div>
        <div className="pet-container">
          <img src={neutral} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}></img>
        </div>
        <div className="text-box">
          <h2>Text</h2>
        </div>
      </div>
    </div>
  )
}

function Checkbox() {
  const [visible, setVisible] = useState(true);

  return (
    <>
      {visible && (
        <div className="check-box">
          <label 
              htmlFor="check" 
            >
              Mark as Complete
            </label>
            <input 
              type="checkbox" 
              id="check" 
              onClick={() => setVisible(false)}
            />
        </div>
      )}
    </>
  )
}

function Footer() {
  return (
    <div className="footer">
      <ul>
        <p><a href="https://my.umbc.edu" target="_blank">myUMBC</a></p>
        <p><a href="https://health.umbc.edu" target="_blank">RIH</a></p>
      </ul>
    </div>
  )
}

export default App

