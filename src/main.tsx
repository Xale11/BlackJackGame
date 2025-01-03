import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import TestGame from './components/TestGame.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TestGame/>
  </StrictMode>,
)
