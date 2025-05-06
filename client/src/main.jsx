import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { app, auth } from './firebaseConfig';
import './index.css'
import App from './App'

const domNode = document.getElementById('root');

if(!domNode) {
  throw new Error('No root element found')
}else{
const root = createRoot(domNode)
root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
}
