import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx' // CRITICAL: Ensure 'App.jsx' casing matches filename
import './index.css' // CRITICAL: Imports the Tailwind CSS layer

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)