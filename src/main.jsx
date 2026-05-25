import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UiProvider } from './context/UiContext'
import { ToastProvider } from './components/ToastContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <UiProvider>
        <App />
      </UiProvider>
    </ToastProvider>
  </StrictMode>,
)
