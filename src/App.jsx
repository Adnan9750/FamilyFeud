import React from 'react'
import './App.css'
import { CssBaseline, Typography } from '@mui/material'
import Dashboard from './pages/Dashboard'
import Example from './pages/Example'
import AdminPanel from './pages/AdminPanel'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

const App = () => {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Dashboard />
    },
    {
      path: '/admin',
      element: <AdminPanel />
    }
  ],
    {
      future: {
        v7_relativeSplatPath: true, // Enable v7 relative splat path behavior
      },
    }
  )

  return (
    <>
      <CssBaseline />
      <RouterProvider router={router} />
    </>
  )
}

export default App
