import { Box, Container, Grid2, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { setFamily, setAnswer, setQuestion, resetAnswer, addScore, setCurrentPoints, switchTeam, setFamilyTurn, addStrike } from '../redux/dashboardSlice';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {

    const navigate = useNavigate()
    const { answers, currentTeamIndex, family: families, question, point } = useSelector(state => state.dashboard);
    const dispatch = useDispatch();
    const totalBoxes = 8;
    const [currentStrike, setCurrentStrike] = useState(0);
    // const [point, setPoint] = useState();
    const [revealedAnswers, setRevealedAnswers] = useState(new Set());
    const [familyWon, setFamilyWon] = useState('')

    console.log("current  data:", families);

    useEffect(() => {
        const socket = io('https://family-feud-backend.onrender.com/');

        socket.on('startGame', (data) => {
            console.log("Start Game:", data);
            dispatch(setFamily(data.families));
            dispatch(setQuestion(data.question));
            setRevealedAnswers(new Set());
            const answersWithReveal = data?.question?.answers?.map(ans => ({
                ...ans,
                revealed: false
            }));
            dispatch(setAnswer(answersWithReveal));
        });

        socket.on('revealAnswer', (data) => {
            console.log("reveal answer:", data);
            if (data?.answer) {
                setRevealedAnswers(prev => {
                    const newSet = new Set(prev);
                    newSet.add(data.answer._id);
                    return newSet;
                });

                const updatedAnswers = answers?.map(ans => ({
                    ...ans,
                    revealed: ans._id === data.answer._id || revealedAnswers.has(ans._id)
                }));

                dispatch(setAnswer(updatedAnswers));
                dispatch(setCurrentPoints(data.answer.points))
                dispatch(setFamilyTurn(data?.familyTurn))
                dispatch(addScore(data?.answer?.points));
            }
        });

        socket.on('strike', (data) => {
            console.log("Strike come:", data);
            setCurrentStrike(data?.countStrike);
            dispatch(setFamilyTurn(data?.familyTurn))
            dispatch(addStrike(data?.countStrike))
            setTimeout(() => {
                setCurrentStrike(0);
            }, 4000);
            // If it's the third strike, transfer score and switch teams
            // if (currentTeamIndex === 0 && data?.countStrike === 3) {
            //     dispatch(switchTeam({ transferScore: true }));

            //     // Reset strikes after a delay
            //     setTimeout(() => {
            //         setCurrentStrike(0);
            //     }, 4000);
            // }
        });

        socket.on('switchFamily', (data) => {
            console.log('switch Family data:', data);
            dispatch(setFamilyTurn(data?.familyTurn))
            setTimeout(() => {
                setCurrentStrike(0);
            }, 4000);
            // Update the UI to show strikes
        })

        // socket.on('strike', (data) => {
        //     setCurrentStrike(data?.countStrike);
        //     setTimeout(() => {
        //         setCurrentStrike(0);
        //     }, 4000);
        // });

        socket.on('newQuestion', (data) => {
            console.log("Next question:", data);
            dispatch(setFamily(data?.families));
            dispatch(setQuestion(data?.question));
            dispatch(setCurrentPoints(0))
            setRevealedAnswers(new Set());
            // dispatch(resetAnswer());
            const answersWithReveal = data?.question?.answers?.map(ans => ({
                ...ans,
                revealed: false
            }));
            dispatch(setAnswer(answersWithReveal));
        });

        socket.on('revealAll', (data) => {
            console.log("Reveal All:", data);
            const fullyRevealedAnswers = answers?.map(ans => ({
                ...ans,
                revealed: true
            }));
            dispatch(setAnswer(fullyRevealedAnswers));
            setRevealedAnswers(new Set(answers?.map(ans => ans._id)))
        })

        socket.on('endGame', (data) => {
            console.log('endGame:', data);

            setFamilyWon(data?.familyWon?.Name)
            setTimeout(() => {
                navigate('/board')
                dispatch(resetAnswer())
            }, 10000)
            // navigate('/board')
            // dispatch(resetAnswer())
            // Update the UI to show strikes
        });

        return () => {
            socket.off('startGame');
            socket.off('revealAnswer');
            socket.off('newQuestion');
            socket.off('strike');
        };
    }, [dispatch, answers, revealedAnswers]);

    const renderAnswerBox = (index, isSecondColumn = false) => {
        const answer = answers?.[index];
        return (
            <Box
                key={index}
                className="h-16 flex items-center justify-center"
            >
                {answer?.revealed ? (
                    <Box className="flex justify-between items-center px-3 w-full h-full flip-in bg-blue-600 border border-blue-300">
                        <Typography variant="h6" sx={{ color: 'white', flex: 1, fontWeight: 'bold' }}>
                            {answer.text}
                        </Typography>
                        <Typography variant="h6" sx={{ color: 'white' }}>
                            {answer.points}
                        </Typography>
                    </Box>
                ) : (
                    <Box className='border border-blue-300 bg-blue-500 w-full h-full flex items-center justify-center'>
                        <Box sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                                {isSecondColumn ? index + 1 : index + 1}
                            </Typography>
                        </Box>
                    </Box>
                )}
            </Box>
        );
    };

    const renderStrikes = () => {
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
                    src="/cross.png"
                    className="w-40 h-40 animate-bounce"
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
            {families.length > 0 ? (
                <Box className='w-full bg-blue-500'>
                    {renderStrikes()}

                    <Box className='absolute top-[40%] left-[28%] z-10'>
                        <Typography variant='h1' sx={{ color: '#fbbf24', textTransform: 'capitalize' }}>{familyWon ? `${familyWon} Won` : ''}</Typography>
                    </Box>

                    <Box className="min-h-screen flex flex-col justify-center items-center gap-20">
                        <Container maxWidth="xl">
                            <Box className='flex flex-col'>
                                {/* Families and Question Section */}
                                <Grid2 container>
                                    <Grid2 size={{ md: 2.5 }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                            <Box className="h-[100px] w-[100px] pt-4 rounded-md bg-[#1e3a8a] flex items-center justify-center">
                                                <img className='h-[85px] w-[85px]' src='/man.png' alt="Family 1" />
                                            </Box>
                                            <Typography variant='body1' color='#fff'>{families[0]?.name}</Typography>
                                        </Box>
                                    </Grid2>
                                    <Grid2 size={{ md: 7 }}>
                                        <Box className="flex flex-col items-center justify-center gap-8 mb-8">
                                            <Box sx={{ maxWidth: { xs: '100%', sm: '600px', md: '800px' } }}
                                                className='flex justify-center w-full bg-blue-950 py-5 rounded-md border-[2px] border-[#C0C0C0]'
                                            >
                                                <Typography variant='body1' color='#fff'>{question?.text}</Typography>
                                            </Box>
                                            <Box sx={{ maxWidth: { xs: '100%', sm: '400px', md: '150px' } }}
                                                className='flex justify-center w-full bg-blue-950 py-5 rounded-md border-[2px] border-[#C0C0C0]'
                                            >
                                                <Typography variant='h3' color='#fff'>{point || 0}</Typography>
                                            </Box>
                                        </Box>
                                    </Grid2>
                                    <Grid2 size={{ md: 2.5 }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                            <Box className="h-[100px] w-[100px] pt-4 rounded-md bg-[#1e3a8a] flex items-center justify-center">
                                                <img className='h-[85px] w-[85px]' src='/woman.png' alt="Family 2" />
                                            </Box>
                                            <Typography variant='body1' color='#fff'>{families[1]?.name}</Typography>
                                        </Box>
                                    </Grid2>
                                </Grid2>

                                {/* Score and Answer Boxes Section */}
                                <Grid2 container>
                                    <Grid2 size={{ xs: 12, md: 3 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                            <Box className="h-[100px] w-[100px] rounded-md bg-[#1e3a8a] flex items-center justify-center">
                                                <Typography variant='h4' color='#fff'>
                                                    {families[0]?.points || 0}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid2>

                                    <Grid2 size={{ xs: 12, md: 6 }}>
                                        <Box sx={{ border: '3px solid yellow', borderRadius: '10px', padding: 1, bgcolor: '#1e3a8a' }}>
                                            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} width="100%">
                                                {/* First column */}
                                                <Box display="flex" flexDirection="column" flex={1}>
                                                    {[0, 1, 2, 3].map(index => renderAnswerBox(index))}
                                                </Box>
                                                {/* Second column */}
                                                <Box display="flex" flexDirection="column" flex={1}>
                                                    {[0, 1, 2, 3].map(index => renderAnswerBox(index + 4, true))}
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Grid2>

                                    <Grid2 size={{ xs: 12, md: 3 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                            <Box className="h-[100px] w-[100px] rounded-md bg-[#1e3a8a] flex items-center justify-center">
                                                <Typography variant='h4' color='#fff'>
                                                    {families[1]?.points || 0}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid2>
                                </Grid2>
                            </Box>
                        </Container>
                    </Box>
                </Box>
            ) : (
                <Box className='min-h-screen bg-blue-500 flex justify-center items-center w-full'>
                    <Typography variant='h3' sx={{color:'#fbbf24'}}>Game not start</Typography>
                </Box>
            )}
        </>
    );
};

export default Dashboard;
