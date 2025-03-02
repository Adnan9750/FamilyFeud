import { Autocomplete, Box, Button, Card, CardContent, Container, Grid2, Modal, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import setupAPI from '../services/Api';
import { Close } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { addScore, addStrike, resetAll, setAnswer, setCurrentFamilyId, setFamily, setQuestion, switchTeam } from '../redux/adminSlice';
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

const AddFamily = () => {
    const dispatch = useDispatch();
    const {
        family, question: currentQuestion,
        strikeCount, answer,
        currentTeamIndex, currentFamilyId, gameStage, firstTeamStrikes, secondTeamStrikes
    } = useSelector(state => state.admin);

    // console.log("Family Data:", family);
    // console.log("Strike Count:",strikeCount)

    const [familyData, setFamilyData] = useState([]);
    const [family1Input, setFamily1Input] = useState('');
    const [family2Input, setFamily2Input] = useState('');
    const [selectedFamily1, setSelectedFamily1] = useState(null);
    const [selectedFamily2, setSelectedFamily2] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [questionCount, setQuestionCount] = useState(0);
    const [quitGame, setQuitGame] = useState(false);
    const MAX_QUESTIONS = 3;

    const reset = () => {
        setFamily1Input('');
        setFamily2Input('');
        setSelectedFamily1(null);
        setSelectedFamily2(null);
    };

    const API = setupAPI();

    const fetchFamilies = async () => {
        try {
            const res = await API.get('/family/get-families');
            setFamilyData(res?.data?.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchFamilies();
    }, []);

    const isSwitchTeamDisabled = answer.some(ans => ans.revealed) || (gameStage === 'first_team' && firstTeamStrikes > 0) || (gameStage === 'second_team_chance' && secondTeamStrikes > 0);

    const createFamily = async (familyName) => {
        try {
            const res = await API.post('/family/create-family', { name: familyName });
            fetchFamilies();
            return res?.data?.family;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const handleCreateFamilies = async () => {
        let family1, family2;
        if (family1Input && !selectedFamily1) {
            family1 = await createFamily(family1Input);
            setSelectedFamily1(family1);
        }
        if (family2Input && !selectedFamily2) {
            family2 = await createFamily(family2Input);
            setSelectedFamily2(family2);
        }
    };

    const handleStartGame = async () => {
        setIsLoading(true);
        try {
            const res = await API.post("/Game/start-game", {
                "family1": selectedFamily1._id,
                "family2": selectedFamily2._id
            });
            dispatch(setFamily(res?.data?.families));
            dispatch(setCurrentFamilyId(res?.data?.families[1]._id)); // Set Hamza (index 1) as default
            dispatch(setQuestion(res?.data?.question));
            setQuestionCount(1);
            reset();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNextQuestion = async () => {
        setIsLoading(true);
        try {
            if (questionCount >= MAX_QUESTIONS) return;
            const res = await API.post('/Game/new-question', {
                questionId: currentQuestion.id,
                family1: family[0]._id,
                family2: family[1]._id
            });
            dispatch(setQuestion(res?.data?.question));
            setQuestionCount(prev => prev + 1);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRevealAnswer = async (answerId) => {
        try {
            const selectedAnswer = answer.find(ans => ans._id === answerId);
            if (selectedAnswer.revealed) return;
            await API.post('/admin/action', {
                familyTurn: family[currentTeamIndex]?._id,
                questionId: currentQuestion.id,
                answerToRevealId: answerId,
                reveal: true
            });
            const updatedAnswers = answer.map(ans =>
                ans._id === answerId ? { ...ans, revealed: true } : ans
            );
            dispatch(setAnswer(updatedAnswers));
            if (selectedAnswer) {
                dispatch(addScore({ points: selectedAnswer.points }));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSwitchTeam = async () => {
        try {
            await API.post('/admin/switch-family', {
                familyTurn: currentFamilyId,
            });
            dispatch(switchTeam());
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddStrike = async () => {
        try {
            console.log("Clicked");
            dispatch(addStrike());
            await API.post('/admin/action', {
                familyTurn: currentFamilyId,
                strike: true,
                countStrike: strikeCount + 1,
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleRevealAll = async () => {
        try {
            await API.post('/admin/reveal-all', {
                questionId: currentQuestion?.id
            });
            const updatedAnswers = answer.map(ans => ({ ...ans, revealed: true }));
            dispatch(setAnswer(updatedAnswers));
        } catch (error) {
            console.error(error);
        }
    };

    const handleEndGame = async () => {
        try {
            const familyWon = family[0].points > family[1].points ? family[0] : family[1];
            const familyLost = family[0].points > family[1].points ? family[1] : family[0];
            await API.post("/Game/end-game", {
                question: currentQuestion.id,
                familyWonId: familyWon._id,
                familyLoseId: familyLost._id,
                familyWonScore: familyWon.points,
                familyLoseScore: familyLost.points
            });
            dispatch(resetAll());
        } catch (error) {
            console.error(error);
        }
    };

    const handleQuitGame = async () => {
        try {
            const res = await API.get("/Game/quit-game");
            console.log("Quit Game:", res);
            if (res?.data?.success) {
                dispatch(resetAll());
                setQuitGame(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Box sx={{ py: 3 }}>
                {family.length > 0 ? (
                    <Container maxWidth="lg">
                        <Card sx={{ bgcolor: '#1e293b', color: 'white', border: '4px solid #fbbf24' }}>
                            <CardContent>
                                <Typography variant="h4" align="center" sx={{ color: '#fbbf24', fontWeight: 'bold', mb: 3 }}>
                                    Admin Panel
                                </Typography>
                                {isLoading ? (
                                    <Typography>Loading ...</Typography>
                                ) : (
                                    <>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: '#1e4ed8', p: 2, borderRadius: 2, mb: 3 }}>
                                            <Typography variant="h6">Current Question:</Typography>
                                            <Typography variant="body1" sx={{ mt: "4px" }}>{currentQuestion?.text}</Typography>
                                        </Box>
                                        <Box sx={{
                                            bgcolor: '#1e4ed8', p: 2, borderRadius: 2,
                                            mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                        }}>
                                            <Typography variant="h6">
                                                Current Team: <span style={{ color: '#fbbf24' }}>{family[currentTeamIndex]?.name}</span>
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography variant="body1">Strikes:</Typography>
                                                    {[...Array(strikeCount)].map((_, index) => (
                                                        <Close
                                                            key={index}
                                                            sx={{
                                                                color:
                                                                    gameStage === 'first_team' && index < firstTeamStrikes
                                                                        ? 'yellow'
                                                                        : gameStage === 'second_team_chance' && index < secondTeamStrikes
                                                                            ? 'yellow'
                                                                            : 'rgba(255,255,255,0.3)',
                                                                fontSize: 28
                                                            }}
                                                        />
                                                    ))}
                                                </Box>
                                                <Button
                                                    variant="contained"
                                                    onClick={handleSwitchTeam}
                                                    disabled={isSwitchTeamDisabled}
                                                    sx={{ bgcolor: '#fbbf24', '&:hover': { bgcolor: '#f59e0b' } }}
                                                >
                                                    Switch Team
                                                </Button>
                                            </Box>
                                        </Box>
                                        <Grid2 container spacing={2}>
                                            {answer?.map((answer) => (
                                                <Grid2 item size={{ xs: 12, md: 6 }} key={answer._id}>
                                                    <Box sx={{
                                                        p: 1,
                                                        borderRadius: 2,
                                                        bgcolor: answer.revealed ? '#15803d' : '#1e4ed8',
                                                        border: `2px solid ${answer.revealed ? '#22c55e' : '#3b82f6'}`,
                                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                                    }}>
                                                        <Box>
                                                            <Typography>{answer.text}</Typography>
                                                        </Box>
                                                        <Typography variant="h6" sx={{ color: '#fbbf24' }}>
                                                            {answer.points} pts
                                                        </Typography>
                                                        <Button
                                                            variant="contained"
                                                            onClick={() => handleRevealAnswer(answer._id)}
                                                            disabled={answer.revealed}
                                                            sx={{ bgcolor: answer.revealed ? '#22c55e' : '#3b82f6' }}
                                                        >
                                                            Reveal
                                                        </Button>
                                                    </Box>
                                                </Grid2>
                                            ))}
                                        </Grid2>
                                        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', mt: 4 }}>
                                            <Button
                                                variant="contained"
                                                onClick={() => setQuitGame(true)}
                                                sx={{ fontSize: '16px', textTransform: 'capitalize', bgcolor: '#b91c1c' }}
                                            >
                                                Quit Game
                                            </Button>
                                            <Button
                                                variant="contained"
                                                startIcon={<Close />}
                                                onClick={handleAddStrike}
                                                disabled={
                                                    currentFamilyId !== family[currentTeamIndex]._id ||
                                                    (gameStage === 'second_team_chance' && secondTeamStrikes >= 1)
                                                }
                                                sx={{ fontSize: '16px', textTransform: 'capitalize', bgcolor: '#b91c1c' }}
                                            >
                                                Add Strike
                                            </Button>
                                            {(gameStage === 'second_team_chance' || secondTeamStrikes >= 1) && (
                                                <Button
                                                    variant="contained"
                                                    onClick={handleRevealAll}
                                                    sx={{ fontSize: '16px', textTransform: 'capitalize', bgcolor: '#fbbf24' }}
                                                >
                                                    Reveal All
                                                </Button>
                                            )}
                                            {questionCount < MAX_QUESTIONS ? (
                                                <Button
                                                    variant="contained"
                                                    onClick={handleNextQuestion}
                                                    sx={{ fontSize: '16px', textTransform: 'capitalize', bgcolor: '#fbbf24' }}
                                                >
                                                    Next Question
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="contained"
                                                    onClick={handleEndGame}
                                                    sx={{ fontSize: '16px', textTransform: 'capitalize', bgcolor: '#fbbf24' }}
                                                >
                                                    End Game
                                                </Button>
                                            )}
                                        </Box>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </Container>
                ) : (
                    <Container maxWidth="lg">
                        <Box className="w-full p-10">
                            <Grid2 container spacing={3}>
                                <Grid2 size={{ xs: 12, md: 6 }}>
                                    <Autocomplete
                                        value={selectedFamily1}
                                        onChange={(event, newValue) => setSelectedFamily1(newValue)}
                                        inputValue={family1Input}
                                        onInputChange={(event, newInputValue) => setFamily1Input(newInputValue)}
                                        options={familyData}
                                        getOptionLabel={(option) => option?.name || ''}
                                        freeSolo
                                        renderInput={(params) => <TextField {...params} placeholder="Enter first family" />}
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 12, md: 6 }}>
                                    <Autocomplete
                                        value={selectedFamily2}
                                        onChange={(event, newValue) => setSelectedFamily2(newValue)}
                                        inputValue={family2Input}
                                        onInputChange={(event, newInputValue) => setFamily2Input(newInputValue)}
                                        options={familyData}
                                        getOptionLabel={(option) => option?.name || ''}
                                        freeSolo
                                        renderInput={(params) => <TextField {...params} placeholder="Enter second family" />}
                                    />
                                </Grid2>
                            </Grid2>
                            <Box className='w-full flex justify-between mt-4'>
                                <Button
                                    variant='outlined'
                                    sx={{ bgcolor: '#3b82f6', color: '#ffff', textTransform: 'capitalize', fontWeight: 500 }}
                                    onClick={handleCreateFamilies}
                                    disabled={!(family1Input && !selectedFamily1)}
                                >
                                    Create First Family
                                </Button>
                                <Button
                                    variant='outlined'
                                    sx={{ bgcolor: '#3b82f6', color: '#ffff', textTransform: 'capitalize', fontWeight: 500 }}
                                    onClick={handleCreateFamilies}
                                    disabled={!(family2Input && !selectedFamily2)}
                                >
                                    Create Second Family
                                </Button>
                            </Box>
                            <Box className='w-full flex justify-center mt-2'>
                                <button
                                    className='bg-blue-700 py-2 px-3 text-white rounded'
                                    onClick={handleStartGame}
                                >
                                    Start Game
                                </button>
                            </Box>
                        </Box>
                    </Container>
                )}
            </Box>
            <Modal
                open={quitGame}
                sx={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "10px" }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "30px",
                        bgcolor: "#FFFFFF",
                        width: "370px",
                        maxWidth: "370px",
                        height: "300px",
                        borderRadius: "12px",
                        padding: "20px",
                    }}
                >
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <CancelOutlinedIcon sx={{ fontSize: "50px", color: "#1d4ed8" }} />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Typography variant="h6" fontWeight={500}>Are you sure?</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Typography textAlign="center" fontSize="18px" fontWeight={500} sx={{ color: "#94A3B8" }}>
                            You want to quit game
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "center", gap: "12px" }}>
                        <Button onClick={() => setQuitGame(false)} sx={{ color: "#1d4ed8", textTransform: "capitalize" }}>
                            <Typography variant="body1" fontWeight={500}>Cancel</Typography>
                        </Button>
                        <Button
                            onClick={() => handleQuitGame()}
                            variant="contained"
                            disableElevation
                            sx={{ bgcolor: "#1d4ed8", borderRadius: "8px", textTransform: "capitalize", "&:hover": { bgcolor: "#1d4ed8" } }}
                        >
                            <Typography variant="body1" fontWeight={500}>Ok</Typography>
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default AddFamily;