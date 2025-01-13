import React from 'react'
import { Link } from 'react-router-dom'
import GridViewIcon from '@mui/icons-material/GridView';
import { Typography } from '@mui/material';

const SideBar = () => {
    return (
        <>
            <div className='relative bg-[#1e3a8a]'>
                <div className={`h-screen transition-all duration-300 border-r px-2 overflow-hidden w-64`}>

                    <div className='h-16 flex items-center px-4 pt-5'>
                        {/* logo part */}
                        <div className='flex flex-col overflow-hidden'>

                            <div className='flex items-center gap-2'>
                                {/* <img src='/Logo.png' className={`w-7 h-7 ml-1`} /> */}
                                <span className={`font-bold text-2xl whitespace-nowrap `}
                                >
                                    FamilyFued
                                </span>
                            </div>

                            {/* <span
                                className={`font-bold text-xs text-[#00000040] whitespace-nowrap 
                  transition-all duration-300 ${!isSidebarOpen ? 'hidden' : 'opacity-100'}`}
                            >
                                Gems saas Platform
                            </span> */}
                        </div>
                    </div>

                    <nav className='flex-1 overflow-y-auto overflow-x-hidden pt-4 '>
                        <div className='flex flex-col justify-center'>
                            {/* Dashboard */}
                            <Link
                                to='/'
                                className={`w-full flex items-center px-4 py-3 hover:bg-blue-950 hover:rounded-xl`}
                            >
                                <div className="min-w-[24px] flex justify-center text-white">
                                    <GridViewIcon />
                                </div>
                                <Typography
                                    sx={{ml:'12px'}}
                                    color='#fff'
                                >
                                    Dashboard
                                </Typography>
                            </Link>

                        </div>
                    </nav>



                </div >
            </div >
        </>
    )
}

export default SideBar
