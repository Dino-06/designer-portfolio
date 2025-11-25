import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx' 
import './index.css' // <-- NOTE: We will use index.css for local dev, but the build script uses dist/tailwind.css

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)