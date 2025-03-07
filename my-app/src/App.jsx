import {Route, Routes, Link} from 'react-router-dom'
import Nav from './Nav'
import Logs from './pages/Logs'
import Store from './pages/Store'
import Resources from './pages/Resources'
import About from './pages/About'
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
            <Route path="/resources" element={<Resources />} />
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
    </div>
  )
}

function Footer() {
  return (
    <div className="footer">
      <ul>
        <p><a href="https://my.umbc.edu">myUMBC</a></p>
        <p><a href="https://health.umbc.edu">RIH</a></p>
      </ul>
    </div>
  )
}

export default App
