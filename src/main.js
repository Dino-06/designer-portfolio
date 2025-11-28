// src/main.js
import App from './App.svelte';
import './app.css'; // keep this if app.css exists and is correct for Tailwind

const app = new App({
  target: document.getElementById('app')
});

export default app;