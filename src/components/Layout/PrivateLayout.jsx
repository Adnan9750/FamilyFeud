import React from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from '../SideBar'
import { Box } from '@mui/material'

const PrivateLayout = () => {
    return (
        <>
            <Box className='flex h-screen' >
                <SideBar />
                <div className="flex-1 overflow-y-auto">
                    <Outlet />
                </div>
            </Box>
        </>
    )
}
// 
export default PrivateLayout
