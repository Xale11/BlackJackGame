import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import TestGame from './components/TestGame.tsx'
import { Provider } from './components/ui/provider.tsx'
import OneVsThree from './pages/OneVsThree.tsx'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <Provider>
      <OneVsThree/>
    </Provider>
  // </StrictMode>,
)
