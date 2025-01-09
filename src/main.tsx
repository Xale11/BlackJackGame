// import { StrictMode } from 'react' // causing problems with initilising blackjack games in dev 
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from './components/ui/provider.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { routes } from './routes.tsx'

const router = createBrowserRouter(routes)

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <Provider>
      <RouterProvider router={router}/>
    </Provider>
  // </StrictMode>,
)
