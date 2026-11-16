import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app/App'
import { CaptureView } from './app/CaptureView'
import './styles/index.css'

const container = document.getElementById('root')
if (!container) throw new Error('Root element #root is missing from index.html')

const params = new URLSearchParams(window.location.search)

createRoot(container).render(
  <StrictMode>{params.has('capture') ? <CaptureView params={params} /> : <App />}</StrictMode>,
)
