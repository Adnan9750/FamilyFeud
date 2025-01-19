import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Container, Typography, Button, Card, CardContent, Grid, Grid2 } from '@mui/material';
import { Close as CloseIcon, CheckCircle as CheckCircleIcon, SwapHoriz as SwapHorizIcon } from '@mui/icons-material';
import { addStrike, revealAnswer, switchTeam } from '../redux/gameSlice';
import setupAPI from '../services/Api';
import { fetchQuestionAnswer } from '../redux/answerSlice';

const AdminPanel = () => {
    const dispatch = useDispatch();
    const { currentQuestion, answers, currentTeam, strikes, isAutoSwitchingTeam } = useSelector(state => state.game);
    const { currentQuestion: Question } = useSelector(state => state.answers)
    const bc = new BroadcastChannel('game-updates');

    console.log("Get answer", Question);

    const API = setupAPI()

    // const fetchAdminData = async () => {
    //     try {
    //         const res = await API.get('/survey/get-surveys')
    //         console.log("data:",res);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    useEffect(() => {
        dispatch(fetchQuestionAnswer())
    }, [dispatch])

    const handleRevealAnswer = (id) => {
        dispatch(revealAnswer(id));
        bc.postMessage({
            type: 'game/revealAnswer',
            payload: id
        });
    };

    const handleAddStrike = () => {
        if (strikes < 3) {
            dispatch(addStrike());
            bc.postMessage({
                type: 'game/addStrike',
                payload: undefined
            });

            if (strikes === 2) {
                setTimeout(() => {
                    dispatch(switchTeam());
                    bc.postMessage({
                        type: 'game/switchTeam',
                        payload: undefined
                    });
                }, 5000);
            }
        }
    }

    const handleSwitchTeam = () => {
        dispatch(switchTeam());
        bc.postMessage({
            type: 'game/switchTeam',
            payload: undefined
        });
    };

    return (
        <>
            <Box sx={{ py: 3, px: 2 }}>
                <Container maxWidth="lg">
                    <Card sx={{ bgcolor: '#1e293b', color: 'white', border: '4px solid #fbbf24' }}>
                        <CardContent>
                            <Typography variant="h4" align="center" sx={{ color: '#fbbf24', fontWeight: 'bold', mb: 3 }}>
                                Admin Panel
                            </Typography>

                            {/* Question Display */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: '#1e4ed8', p: 2, borderRadius: 2, mb: 3 }}>
                                <Typography variant="h6">Current Question:</Typography>
                                <Typography variant="body1" sx={{ mt: "4px" }}>{Question?.question}</Typography>
                            </Box>

                            {/* Team and Strikes Display */}
                            <Box sx={{
                                bgcolor: '#1e4ed8',
                                p: 2,
                                borderRadius: 2,
                                mb: 3,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <Typography variant="h6">
                                    Current Team: <span style={{ color: '#fbbf24' }}>Team {currentTeam}</span>
                                </Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="body1">Strikes:</Typography>
                                        {[...Array(3)].map((_, index) => (
                                            <CloseIcon
                                                key={index}
                                                sx={{
                                                    color: index < strikes ? 'yellow' : 'rgba(255,255,255,0.3)',
                                                    fontSize: 28
                                                }}
                                            />
                                        ))}
                                    </Box>

                                    <Button
                                        variant="contained"
                                        startIcon={<SwapHorizIcon />}
                                        onClick={handleSwitchTeam}
                                        // disabled={showingStrikes && strikes === 3}
                                        sx={{
                                            bgcolor: '#fbbf24',
                                            '&:hover': { bgcolor: '#f59e0b' }
                                        }}
                                    >
                                        Switch Team
                                    </Button>
                                </Box>
                            </Box>

                            {/* Answers Grid */}
                            <Grid2 container spacing={2}>
                                {Question?.answers?.map((answer, index) => (
                                    <Grid2 key={index} item size={{ xs: 12, md: 6 }} >
                                        <Box sx={{
                                            p: 1,
                                            borderRadius: 2,
                                            bgcolor: answer.revealed ? '#15803d' : '#1e4ed8',
                                            border: `2px solid ${answer.revealed ? '#22c55e' : '#3b82f6'}`,
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                        }}>
                                            <Box >
                                                {/* <Typography variant="h6">Answer {answer.id}</Typography> */}
                                                <Typography>{answer.text}</Typography>
                                            </Box>

                                            <Typography variant="h6" sx={{ color: '#fbbf24' }}>
                                                {answer.points} pts
                                            </Typography>

                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Button
                                                    variant="contained"
                                                    startIcon={answer.revealed ? <CheckCircleIcon /> : null}
                                                    onClick={() => handleRevealAnswer(answer.id)}
                                                    disabled={answer.revealed}
                                                    sx={{
                                                        bgcolor: answer.revealed ? '#22c55e' : '#3b82f6',
                                                        '&:hover': { bgcolor: answer.revealed ? '#22c55e' : '#2563eb' }
                                                    }}
                                                >
                                                    {answer.revealed ? 'Revealed' : 'Reveal'}
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Grid2>
                                ))}
                            </Grid2>

                            {/* Strike Button */}
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                <Button
                                    variant="contained"
                                    color="error"
                                    size="small"
                                    startIcon={<CloseIcon />}
                                    onClick={handleAddStrike}
                                    disabled={strikes >= 3}
                                    sx={{
                                        fontSize: '16px'
                                    }}
                                >
                                    Add Strike
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Container>
            </Box>
        </>
    );
};

export default AdminPanel;