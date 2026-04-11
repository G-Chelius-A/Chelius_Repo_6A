import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Card from './components/Card.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Card 
        imagen="mapache"
        nombre="Mapache"
        pais="México"
        contenido="Me ha pasado. Mapachao"
      />
      <Card 
        imagen="pollo"
        nombre="Pollo"
        pais="Guatemala"
        contenido="Pollo que vulea"
      />
      <Card 
        imagen="tigre"
        nombre="Tigre"
        pais="Myanmar"
        contenido="Un tigre muy feroz"
      />
  </StrictMode>,
)