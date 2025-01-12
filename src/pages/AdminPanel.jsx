import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Container, Typography, Button, Card, CardContent, Grid } from '@mui/material';
import { Close as CloseIcon, CheckCircle as CheckCircleIcon, SwapHoriz as SwapHorizIcon } from '@mui/icons-material';
import { addStrike, revealAnswer, switchTeam } from '../redux/gameSlice';

const AdminPanel = () => {
    const dispatch = useDispatch();
    const { currentQuestion, answers, currentTeam, strikes, isAutoSwitchingTeam } = useSelector(state => state.game);
    const bc = new BroadcastChannel('game-updates');

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
        <Box sx={{ minHeight: '100vh', bgcolor: '#1e3a8a', py: 3 }}>
            <Container maxWidth="lg">
                <Card sx={{ bgcolor: '#1e293b', color: 'white', border: '4px solid #fbbf24' }}>
                    <CardContent>
                        <Typography variant="h4" align="center" sx={{ color: '#fbbf24', fontWeight: 'bold', mb: 3 }}>
                            Admin Panel
                        </Typography>

                        {/* Question Display */}
                        <Box sx={{ bgcolor: '#1e4ed8', p: 2, borderRadius: 2, mb: 3 }}>
                            <Typography variant="h6">Current Question:</Typography>
                            <Typography variant="body1" sx={{ mt: 1 }}>{currentQuestion}</Typography>
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
                        <Grid container spacing={2}>
                            {answers.map((answer) => (
                                <Grid item xs={12} md={6} key={answer.id}>
                                    <Box sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        bgcolor: answer.revealed ? '#15803d' : '#1e4ed8',
                                        border: `2px solid ${answer.revealed ? '#22c55e' : '#3b82f6'}`
                                    }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="h6">Answer {answer.id}</Typography>
                                            <Typography variant="h6" sx={{ color: '#fbbf24' }}>
                                                {answer.points} pts
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography>{answer.text}</Typography>
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
                                </Grid>
                            ))}
                        </Grid>

                        {/* Strike Button */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <Button
                                variant="contained"
                                color="error"
                                size="large"
                                startIcon={<CloseIcon />}
                                onClick={handleAddStrike}
                                disabled={strikes >= 3}
                                sx={{
                                    px: 4,
                                    py: 2,
                                    fontSize: '1.2rem'
                                }}
                            >
                                Add Strike
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default AdminPanel;