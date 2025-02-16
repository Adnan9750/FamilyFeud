import React from 'react'
import './App.css'
import { CssBaseline, ThemeProvider, Typography, createTheme } from '@mui/material'
import Dashboard from './pages/Dashboard'
import Example from './pages/Example'
import AdminPanel from './pages/AdminPanel'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import PrivateLayout from './components/Layout/PrivateLayout'
import AddFamily from './pages/AddFamily'
import ManageFamilies from './pages/ManageFamilies'
import Login from './pages/Login'
import LeaderBoard from './pages/LeaderBoard'
import AddQuestion from './pages/AddQuestionFile'
import GameQuestion from './pages/GameQuestion'

const theme = createTheme({
  components: {
    MuiTable: {
      styleOverrides: {
        root: {
          // borderCollapse: "collapse",
          border: "none"
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          // padding: "8px 8px",//
          color: '#515151',
          border: "none"
        },
        head: {
          fontWeight: 700,
          color: '#212121'
        },
      },
    },
  },
});

const App = () => {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Dashboard />
    },
    {
      path: '/login', element: <Login />
    },
    {
      path: '/board', element: <LeaderBoard />
    },
    {
      path: '/',
      element: <PrivateLayout />,
      children: [
        { path: '/playGame', element: <AddFamily /> },
        { path: '/addQuestion', element: <GameQuestion /> },
        { path: '/family', element: <ManageFamilies /> }
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
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </>
  )
}

export default App
