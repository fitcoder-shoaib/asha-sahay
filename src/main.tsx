import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Fonts are bundled (not pulled from Google) so the app also works with no network.
import '@fontsource/inter/latin-400.css'
import '@fontsource/noto-sans-devanagari/devanagari-400.css'
import '@fontsource/noto-sans-malayalam/malayalam-400.css'
import '@fontsource/inter/latin-500.css'
import '@fontsource/noto-sans-devanagari/devanagari-500.css'
import '@fontsource/noto-sans-malayalam/malayalam-500.css'
import '@fontsource/inter/latin-600.css'
import '@fontsource/noto-sans-devanagari/devanagari-600.css'
import '@fontsource/noto-sans-malayalam/malayalam-600.css'
import '@fontsource/inter/latin-700.css'
import '@fontsource/noto-sans-devanagari/devanagari-700.css'
import '@fontsource/noto-sans-malayalam/malayalam-700.css'
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
