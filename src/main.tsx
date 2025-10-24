import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { ToastContainer } from 'react-toastify'
import './i18n/config'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

console.log('Main.tsx rendering, root element found:', rootElement)

createRoot(rootElement).render(
  <StrictMode>
    <App />
    <ToastContainer />
  </StrictMode>,
)
