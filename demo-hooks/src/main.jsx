import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import UsaHook from './components/UsaHook.jsx'
import UsaHookEffect from './components/UsaHookEffect.jsx'
import MuestraPokemon from './components/MuestraPokemon.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MuestraPokemon />
  </StrictMode>,
)
