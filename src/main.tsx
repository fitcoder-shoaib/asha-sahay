import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import './styles-profile.css'
import './styles-visits.css'
import './styles-quiz.css'
import './styles-extra.css'
import './styles-polish.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
