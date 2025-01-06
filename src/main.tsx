import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import TestGame from './components/TestGame.tsx'
import { Provider } from './components/ui/provider.tsx'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <Provider>
      <TestGame/>
    </Provider>
  // </StrictMode>,
)
