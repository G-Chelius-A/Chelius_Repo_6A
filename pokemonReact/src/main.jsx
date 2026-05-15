import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import PokemonCard from './components/PokemonCard.jsx'
import PokeButton from './components/PokeButton.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PokeButton />
  </StrictMode>,
)
