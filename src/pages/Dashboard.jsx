import { Box, Container, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { switchTeam } from '../redux/gameSlice';

const Dashboard = () => {
    const { answers, strikes, showingStrikes,isAutoSwitchingTeam  } = useSelector(state => state.game);
    const dispatch = useDispatch();
    const totalBoxes = 8;
    const [showCrosses, setShowCrosses] = useState(false);
    const [currentStrike, setCurrentStrike] = useState(0);
    const strikeSound = new Audio('/Strike.mp3');

    useEffect(() => {
        const bc = new BroadcastChannel('game-updates');

        bc.onmessage = (event) => {
            const { type, payload } = event.data;
            dispatch({ type, payload });
            if (type === 'game/addStrike') {
                strikeSound.currentTime = 0; 
                strikeSound.play().catch(error => console.log('Audio play failed:', error));
            }
        };

        return () => bc.close();
    }, [dispatch]);

    useEffect(() => {
        if (showingStrikes && strikes > 0) {
            // Show crosses for current strike
            setCurrentStrike(strikes);
            setShowCrosses(true);

            // Hide crosses after 5 seconds
            const timer = setTimeout(() => {
                setShowCrosses(false);
                
                // If it's the third strike, switch teams after hiding crosses
                if (strikes === 3 && isAutoSwitchingTeam) {
                    dispatch(switchTeam());
                }
            }, 5000);

            return () => clearTimeout(timer);
        } else {
            setShowCrosses(false);
            setCurrentStrike(0);
        }
    }, [strikes, showingStrikes, isAutoSwitchingTeam, dispatch]);
    
    const displayAnswers = answers
        .filter(answer => answer.revealed)
        .map(answer => ({
            number: answer.id,
            text: answer.text,
            percentage: answer.points.toString()
        }));

    const renderStrikes = () => {
        if (!showCrosses) return null;

        return [...Array(currentStrike)].map((_, index) => (
            <Box
                key={index}
                position="absolute"
                zIndex={10}
                sx={{
                    top: '30%',
                    left: index === 0 ? '30%' : index === 1 ? '45%' : '60%',
                    transition: 'all 0.3s ease-in-out',
                    animation: 'fadeIn 0.5s ease-in-out'
                }}
            >
                <img
                    src="/cross1.png"
                    className="w-36 h-36 animate-bounce"
                    alt={`Strike ${index + 1}`}
                    style={{
                        animation: `bounce${index + 1} 0.5s ease-in-out`
                    }}
                />
            </Box>
        ));
    };

    return (
        <>
            <Box className='w-full bg-blue-500'>

                {renderStrikes()}

                <Box className=" min-h-screen flex items-center py-5">
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
            </Box>
        </>
    );
};

export default Dashboard;
