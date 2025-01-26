import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import GridViewIcon from '@mui/icons-material/GridView';
import { Typography } from '@mui/material';
import SportsEsportsOutlinedIcon from '@mui/icons-material/SportsEsportsOutlined';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import Diversity3OutlinedIcon from '@mui/icons-material/Diversity3Outlined';

const SideBar = () => {

    const location = useLocation()

    return (
        <>
            <div className='relative '>
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
                        </div>
                    </div>

                    <nav className='flex-1 overflow-y-auto overflow-x-hidden pt-4 '>
                        <div className='flex flex-col gap-1 justify-center'>
                            {/* Dashboard */}
                            <Link
                                to='/playGame'
                                className={`w-full flex items-center px-4 py-3 hover:bg-blue-200 hover:rounded-lg 
                                    ${location.pathname === '/playGame' ? 'bg-blue-100 rounded-lg' : ''}`
                                }
                            >
                                <div className="min-w-[24px] flex justify-center text-[#1e3a8a]">
                                    <SportsEsportsOutlinedIcon />
                                </div>
                                <Typography
                                    sx={{ ml: '12px' }}
                                    color='#1e3a8a'
                                >
                                    Play Game
                                </Typography>
                            </Link>

                            {/* <Link
                                to='#'
                                className={`w-full flex items-center px-4 py-3 hover:bg-blue-200 hover:rounded-lg`}
                            >
                                <div className="min-w-[24px] flex justify-center text-[#1e3a8a]">
                                    <QuestionAnswerOutlinedIcon />
                                </div>
                                <Typography
                                    sx={{ ml: '12px' }}
                                    color='#1e3a8a'
                                >
                                    Add Question
                                </Typography>
                            </Link> */}

                            <Link
                                to='/family'
                                className={`w-full flex items-center px-4 py-3 hover:bg-blue-200 hover:rounded-lg
                                    ${location.pathname === '/family' ? 'bg-blue-100 rounded-lg' : ''}`
                                }
                            >
                                <div className="min-w-[24px] flex justify-center text-[#1e3a8a]">
                                    <Diversity3OutlinedIcon />
                                </div>
                                <Typography
                                    sx={{ ml: '12px' }}
                                    color='#1e3a8a'
                                >
                                    Manage Families
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
