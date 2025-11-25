import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx' 
import './dist/tailwind.css' // <-- CHANGE: Importing the compiled CSS file
import './index.css' // <-- REMOVE THIS LINE IF IT EXISTS (it's no longer needed)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)