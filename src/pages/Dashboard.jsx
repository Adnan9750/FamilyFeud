import { Box, Container, Grid2, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { switchTeam } from '../redux/gameSlice';
import { io } from 'socket.io-client';
import { setFamily, setAnswer, setQuestion } from '../redux/dashboardSlice';

const Dashboard = () => {
    // const { answers, strikes, showingStrikes, isAutoSwitchingTeam } = useSelector(state => state.game);

    const { answers, family: families, question } = useSelector(state => state.dashboard)
    const dispatch = useDispatch();
    const totalBoxes = 8;
    // const [showCrosses, setShowCrosses] = useState(false);
    const [currentStrike, setCurrentStrike] = useState(0);
    // const strikeSound = new Audio('/Strike.mp3');
    // const [start, setStart] = useState(false)

    // const [families, setFamilies] = useState([])
    // const [question, setQuestion] = useState([])
    // const [answer, setAnswer] = useState([])

    console.log("Answer:", answers);

    useEffect(() => {
        const socket = io('https://family-feud-backend.onrender.com/');

        socket.on('startGame', (data) => {
            // console.log('startGame:', data);
            dispatch(setFamily(data.families))
            dispatch(setQuestion(data.question))
            const answersWithReveal = data.question.answers.map(ans => ({
                ...ans,
                revealed: false
            }));
            dispatch(setAnswer(answersWithReveal))
        });

        socket.on('revealAnswer', (data) => {
            // console.log('Current answers before reveal:', answers);
            // console.log('Revealed answer data:', data);

            if (answers && answers.length > 0) {
                const updatedAnswers = answers.map(ans => {
                    if (ans._id === data.answer._id) {
                        return { ...ans, revealed: true };
                    }
                    return ans;
                });
                console.log('Updating answers to:', updatedAnswers);
                dispatch(setAnswer(updatedAnswers));
            }

        });

        socket.on('strike', (data) => {
            console.log('Strike Count:', data.countStrike);
            setCurrentStrike(data?.countStrike)
            setTimeout(() => {
                setCurrentStrike(0)
            }, 4000)
            // Update the UI to show strikes
        });


        socket.on('newQuestion', (data) => {
            // console.log('newQuestion:', data);
            dispatch(setFamily(data.families))
            dispatch(setQuestion(data.question))
            const answersWithReveal = data.question.answers.map(ans => ({
                ...ans,
                revealed: false
            }));
            dispatch(setAnswer(answersWithReveal))
        });

        return () => {
            socket.disconnect();
        };
    }, [])

    // useEffect(() => {
    //     const bc = new BroadcastChannel('game-updates');

    //     bc.onmessage = (event) => {
    //         const { type, payload } = event.data;
    //         dispatch({ type, payload });
    //         if (type === 'game/addStrike') {
    //             strikeSound.currentTime = 0;
    //             strikeSound.play().catch(error => console.log('Audio play failed:', error));
    //         }
    //     };

    //     return () => bc.close();
    // }, [dispatch]);

    // useEffect(() => {
    //     if (showingStrikes && strikes > 0) {
    //         // Show crosses for current strike
    //         setCurrentStrike(strikes);
    //         setShowCrosses(true);

    //         // Hide crosses after 5 seconds
    //         const timer = setTimeout(() => {
    //             setShowCrosses(false);

    //             // If it's the third strike, switch teams after hiding crosses
    //             if (strikes === 3 && isAutoSwitchingTeam) {
    //                 dispatch(switchTeam());
    //             }
    //         }, 5000);

    //         return () => clearTimeout(timer);
    //     } else {
    //         setShowCrosses(false);
    //         setCurrentStrike(0);
    //     }
    // }, [strikes, showingStrikes, isAutoSwitchingTeam, dispatch]);

    // const displayAnswers = answers
    //     .filter(answer => answer.revealed)
    //     .map(answer => ({
    //         number: answer.id,
    //         text: answer.text,
    //         percentage: answer.points.toString()
    //     }));

    // useEffect(() => {
    //     let timer;
    //     if (currentStrike > 0) {
    //         timer = setTimeout(() => {
    //             setCurrentStrike(0);
    //         }, 4000); // 4 seconds
    //     }
    //     return () => {
    //         if (timer) {
    //             clearTimeout(timer);
    //         }
    //     };
    // }, [currentStrike]);

    const renderStrikes = () => {
        // if (!showCrosses) return null;

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

            {
                families.length > 0 ? (
                    <Box className='w-full bg-blue-500'>

                        {renderStrikes()}

                        <Box className=" min-h-screen flex flex-col justify-center items-center gap-20">

                            <Container maxWidth="xl">
                                <Box className='flex flex-col'>

                                    <Grid2 container>
                                        <Grid2 size={{ md: 2.5 }}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                                <Box className="h-[100px] w-[100px] pt-4 rounded-md bg-[#1e3a8a] flex items-center justify-center">
                                                    <img className='h-[85px] w-[85px]' src='/man.png' />
                                                </Box>
                                                <Typography variant='body1' color='#fff'>{families[0]?.name}</Typography>
                                            </Box>
                                        </Grid2>
                                        <Grid2 size={{ md: 7 }}>
                                            <Box className="flex flex-col items-center justify-center gap-8 mb-8">
                                                <Box sx={{ maxWidth: { xs: '100%', sm: '600px', md: '800px' } }}
                                                    className='flex justify-center w-full bg-blue-950 py-5 rounded-md border-[2px] border-[#C0C0C0]'
                                                >
                                                    <Typography variant='body1' color='#fff'>{question.text}</Typography>
                                                </Box>
                                                <Box sx={{ maxWidth: { xs: '100%', sm: '400px', md: '150px' } }}
                                                    className='flex justify-center w-full bg-blue-950 py-5 rounded-md border-[2px] border-[#C0C0C0]'
                                                >
                                                    <Typography variant='h3' color='#fff'>72</Typography>
                                                </Box>
                                            </Box>
                                        </Grid2>
                                        <Grid2 size={{ md: 2.5 }}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                                <Box className="h-[100px] w-[100px] pt-4 rounded-md bg-[#1e3a8a] flex items-center justify-center">
                                                    <img className='h-[85px] w-[85px]' src='/woman.png' />
                                                </Box>
                                                <Typography variant='body1' color='#fff'>{families[1]?.name}</Typography>
                                            </Box>
                                        </Grid2>
                                    </Grid2>

                                    <Grid2 container>

                                        <Grid2 size={{ xs: 12, md: 3 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                                <Box className="h-[100px] w-[100px] rounded-md bg-[#1e3a8a] flex items-center justify-center">
                                                    <Typography variant='h4' color='#fff'>
                                                        {families[0]?.score}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Grid2>

                                        <Grid2 size={{ xs: 12, md: 6 }}>
                                            <Box sx={{ border: '3px solid yellow', borderRadius: '10px', padding: 1, bgcolor: '#1e3a8a', }}>
                                                <Box
                                                    display="flex"
                                                    flexDirection={{ xs: 'column', md: 'row' }}
                                                    // gap={4}
                                                    width="100%"
                                                >
                                                    {/* First column: Boxes 1–4 */}
                                                    <Box display="flex" flexDirection="column" flex={1}>
                                                        {[...Array(totalBoxes / 2)].map((_, index) => {
                                                            const answer = answers?.[index];
                                                            return (
                                                                <Box
                                                                    key={index}
                                                                    className=" h-16  flex items-center justify-center"
                                                                >
                                                                    {answer && answer.revealed ? (
                                                                        // Render API data
                                                                        <>
                                                                            <Box
                                                                                className={`flex justify-between items-center px-3 w-full h-full 
                                                        ${answer ? "flip-in bg-blue-600 border border-blue-300 " : "border border-blue-300 "}`}
                                                                            >
                                                                                <Typography variant="h6" sx={{ color: 'white', flex: 1, fontWeight: 'bold' }}>
                                                                                    {answer.text}
                                                                                </Typography>
                                                                                <Typography variant="h6" sx={{ color: 'white' }}>
                                                                                    {answer.points}
                                                                                </Typography>
                                                                            </Box>
                                                                        </>
                                                                    ) : (
                                                                        // Render default index if no data  
                                                                        <Box className='border border-blue-300 bg-blue-500 w-full h-full flex items-center justify-center'>
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
                                                    <Box display="flex" flexDirection="column" flex={1}>
                                                        {[...Array(totalBoxes / 2)].map((_, index) => {
                                                            const answer = answers?.[index + 4];
                                                            return (
                                                                <Box
                                                                    key={index}
                                                                    className="h-16  flex items-center justify-center"
                                                                >
                                                                    {answer && answer.revealed ? (
                                                                        // Render API data
                                                                        <>
                                                                            <Box
                                                                                className={`flex justify-between items-center  px-3 w-full h-full 
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
                                                                        <Box className='border border-blue-300 bg-blue-500 w-full h-full flex items-center justify-center'>
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
                                            </Box>
                                        </Grid2>

                                        <Grid2 size={{ xs: 12, md: 3 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                                <Box className="h-[100px] w-[100px] rounded-md bg-[#1e3a8a] flex items-center justify-center">
                                                    <Typography variant='h4' color='#fff'>
                                                        {families[1]?.score}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Grid2>

                                    </Grid2>
                                </Box>
                            </Container>
                        </Box>
                    </Box >
                ) : (
                    <Box className='min-h-screen bg-blue-500 flex justify-center items-center w-full'>
                        <Typography variant='h3'>Game not start</Typography>
                    </Box>
                )
            }

        </>
    );
};

export default Dashboard;
