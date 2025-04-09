import {Route, Routes, } from 'react-router-dom'
import {useState} from 'react'
import Nav from './Nav'
import Logs from './pages/Logs'
import Store from './pages/Store'
import ResourcePage from './pages/ResourcePage'
import About from './pages/About'
import neutral from './assets/chip-neutral.png'
import './App.css'

function App() {
  return (
    <div>
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
    <div>
      <h1>Welcome to Paw Printz!</h1>
      <p> This is the home page </p>
      <Checkbox />
      <div className="pet-container">
        <img src={neutral}></img>
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
