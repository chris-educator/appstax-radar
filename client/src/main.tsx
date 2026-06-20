import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'
import { registerServiceWorker } from './utils/registerServiceWorker'

void registerServiceWorker()
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
