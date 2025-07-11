import { createRoot } from 'react-dom/client'
// import './index.css'
import '../src/styles/app.css'
import App from './App.jsx'
import {RouterProvider } from 'react-router-dom'
import routes from './assets/routes.jsx'

createRoot(document.getElementById('root')).render(
  <RouterProvider router={routes} />
)
