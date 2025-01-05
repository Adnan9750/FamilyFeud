import { Box, Container, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const Dashboard = () => {
    const { answers, strikes } = useSelector(state => state.game);
    const dispatch = useDispatch();
    const totalBoxes = 8;

    useEffect(() => {
        const bc = new BroadcastChannel('game-updates');

        bc.onmessage = (event) => {
            const { type, payload } = event.data;
            // Dispatch the received action to update local Redux store
            dispatch({ type, payload });
        };

        return () => bc.close();
    }, [dispatch]);

    // Transform answers for dashboard display
    const displayAnswers = answers
        .filter(answer => answer.revealed)
        .map(answer => ({
            number: answer.id,
            text: answer.text,
            percentage: answer.points.toString()
        }));

    console.log("Display strikes:", strikes);

    return (
        <>
            <Box className="w-full bg-blue-500 min-h-screen flex items-center py-5">
                {
                    strikes > 0 && (
                        <Box position='absolute' top='50%' left='50%'>
                            <Typography color='#fff'>Strike</Typography>
                        </Box>
                    )
                }
                <Container
                    maxWidth="lg"
                    sx={{
                        bgcolor: '#1e3a8a',
                        padding: '20px',
                        border: '5px solid yellow',
                        borderRadius: '12px'
                        // mt:{xs:"40px",md:'0px'}
                    }}
                >
                    <Box
                        display="flex"
                        flexDirection={{ xs: 'column', md: 'row' }}
                        gap={4}
                        width="100%"
                    >
                        {/* First column: Boxes 1–4 */}
                        <Box display="flex" flexDirection="column" gap={3} flex={1}>
                            {[...Array(totalBoxes / 2)].map((_, index) => {
                                const answer = displayAnswers.find(a => a.number === index + 1);
                                return (
                                    <Box
                                        key={index}
                                        className=" h-16 rounded-lg flex items-center justify-center"
                                    >
                                        {answer ? (
                                            // Render API data
                                            <>
                                                <Box
                                                    className={`flex justify-between items-center rounded-lg px-3 w-full h-full 
                                                    ${answer ? "flip-in bg-blue-600 border border-blue-300 " : "border border-blue-300 "}`}
                                                >
                                                    <Typography variant="h6" sx={{ color: 'white', flex: 1, fontWeight: 'bold' }}>
                                                        {answer.text}
                                                    </Typography>
                                                    <Typography variant="h6" sx={{ color: 'white' }}>
                                                        {answer.percentage}
                                                    </Typography>
                                                </Box>
                                            </>
                                        ) : (
                                            // Render default index if no data  
                                            <Box className='border border-blue-300 bg-blue-500 w-full h-full rounded-lg flex items-center justify-center'>
                                                <Box
                                                    sx={{
                                                        width: 40,
                                                        height: 40,
                                                        borderRadius: '50%',
                                                        backgroundColor: 'rgba(0,0,0,0.3)',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        // marginRight: 2,
                                                    }}
                                                >
                                                    <Typography
                                                        variant="h6"
                                                        sx={{ color: 'white', fontWeight: 700 }}
                                                    >
                                                        {index + 1}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        )}
                                    </Box>
                                );
                            })}
                        </Box>

                        {/* Second column: Boxes 5–8 */}
                        <Box display="flex" flexDirection="column" gap={3} flex={1}>
                            {[...Array(totalBoxes / 2)].map((_, index) => {
                                {/* const currentIndex = index + 5; // Start from 5 for the second column */ }
                                const answer = displayAnswers.find(a => a.number === index + 5);
                                return (
                                    <Box
                                        key={index}
                                        className="h-16 rounded-lg flex items-center justify-center"
                                    >
                                        {answer ? (
                                            // Render API data
                                            <>
                                                <Box
                                                    className={`flex justify-between items-center rounded-lg px-3 w-full h-full 
                                                    ${answer ? "flip-in bg-blue-600 border border-blue-300 " : "border border-blue-300 "}`}
                                                >
                                                    <Typography variant="h6" sx={{ color: 'white', flex: 1, fontWeight: 'bold' }}>
                                                        {answer.text}
                                                    </Typography>
                                                    <Typography variant="h6" sx={{ color: 'white' }}>
                                                        {answer.percentage}
                                                    </Typography>
                                                </Box>
                                            </>
                                        ) : (
                                            // Render default index if no data
                                            <Box className='border border-blue-300 bg-blue-500 w-full h-full rounded-lg flex items-center justify-center'>
                                                <Box
                                                    sx={{
                                                        width: 40,
                                                        height: 40,
                                                        borderRadius: '50%',
                                                        backgroundColor: 'rgba(0,0,0,0.3)',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        // marginRight: 2,
                                                    }}
                                                >
                                                    <Typography
                                                        variant="h6"
                                                        sx={{ color: 'white', fontWeight: 700 }}
                                                    >
                                                        {index + 5}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        )}
                                    </Box>
                                );
                            })}
                        </Box>
                    </Box>
                </Container>
            </Box>
        </>
    );
};

export default Dashboard;
