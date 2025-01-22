import React from 'react'
import './App.css'
import { CssBaseline, Typography } from '@mui/material'
import Dashboard from './pages/Dashboard'
import Example from './pages/Example'
import AdminPanel from './pages/AdminPanel'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import PrivateLayout from './components/Layout/PrivateLayout'
import AddFamily from './pages/AddFamily'

const App = () => {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Dashboard />
    },
    {
      path: '/',
      element: <PrivateLayout />,
      children:[
        {path:'/playGame',element: <AddFamily/>}
        // { path: '/admin', element: <AdminPanel /> },
      ]
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
