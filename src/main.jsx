import React from 'react' // eslint-disable-line no-unused-vars
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom' // eslint-disable-line no-unused-vars
import router from './router'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
