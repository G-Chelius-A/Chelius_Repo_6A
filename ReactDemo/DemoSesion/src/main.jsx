import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
//import AppLocalStorage from './sessionLocalStorage/AppLocalStorage.jsx';
import AppCookies from './cookiesSesion/AppCookies.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppCookies />
  </StrictMode>,
)
