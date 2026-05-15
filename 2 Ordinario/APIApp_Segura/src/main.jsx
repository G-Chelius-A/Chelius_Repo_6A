import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppProtectedRoute from './protectedRoute/AppProtectedRoute.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProtectedRoute />
  </StrictMode>,
)
