import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from '../App'
import Home from './pages/Home'
import Workspace from './pages/Workspace'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}> 
          <Route index element={<Home />} />
          <Route path="/workspace/:id" element={<Workspace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
