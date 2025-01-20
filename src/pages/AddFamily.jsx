import { Autocomplete, Box, Button, Card, CardContent, Container, Grid2, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import setupAPI from '../services/Api'
import { Close } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { addPoints, setAnswer, setFamily, setQuestion } from '../redux/adminSlice'

const AddFamily = () => {

    const dispatch = useDispatch()
    const { family, question: currentQuestion, answer, currentTeamIndex, scores } = useSelector(state => state.admin)

    const [familyData, setFamilyData] = useState([])
    const [family1Input, setFamily1Input] = useState('')
    const [family2Input, setFamily2Input] = useState('')
    const [selectedFamily1, setSelectedFamily1] = useState(null)
    const [selectedFamily2, setSelectedFamily2] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [strikeCount, setStrikeCount] = useState(0)

    console.log("Team index:", currentTeamIndex);

    console.log("Team score:", scores);

    const API = setupAPI()

    const fetchFamilies = async () => {
        try {
            const res = await API.get('/family/get-families')
            console.log("get family,", res)
            setFamilyData(res?.data?.data)
        } catch (error) {
            console.log(error)
        }
    }

    const createFamily = async (familyName) => {
        try {
            const res = await API.post('/family/create-family', {
                name: familyName
            })
            console.log("created family:", res)
            setFamilyData(pervData => {
                pervData,
                    res?.data?.family
            })
            // Refresh the families list
            fetchFamilies()
            // return res?.data?.data
        } catch (error) {
            console.log(error)
            return null
        }
    }

    const handleCreateFamilies = async () => {
        let family1, family2

        // Create family 1 if it's a new entry
        if (family1Input && !selectedFamily1) {
            family1 = await createFamily(family1Input)
            setSelectedFamily1(family1._id)
        }

        // Create family 2 if it's a new entry
        if (family2Input && !selectedFamily2) {
            family2 = await createFamily(family2Input)
            setSelectedFamily2(family2._id)
        }

        // Here you can handle what happens after both families are created/selected
        // For example, you might want to create a relationship between them
        if ((selectedFamily1 || family1) && (selectedFamily2 || family2)) {
            // Add your logic here to handle the relationship between families
            console.log("Both families selected/created:",
                selectedFamily1 || family1,
                selectedFamily2 || family2
            )
        }
    }

    useEffect(() => {
        fetchFamilies()
    }, [])

    const handleStartGame = async () => {
        setIsLoading(true)
        try {
            const res = await API.post("/Game/start-game", {
                "family1": selectedFamily1._id,
                "family2": selectedFamily2._id
            })
            console.log("Start game:", res);
            dispatch(setFamily(res?.data?.families))
            dispatch(setQuestion(res?.data?.question))
            dispatch(setAnswer(res?.data?.question?.answers))
        } catch (error) {
            console.log(error);
            setIsLoading(false)
        } finally {
            setIsLoading(false)
        }
    }

    const handleNextQuestion = async () => {
        setIsLoading(true)
        try {
            const res = await API.post('/Game/new-question', {
                questionId: currentQuestion.id,
                family1: family[0]._id,
                family2: family[1]._id
            })
            console.log("Next Question", res);
            dispatch(setQuestion(res?.data?.question))
            dispatch(setAnswer(res?.data?.question?.answers))
        } catch (error) {
            setIsLoading(false)
        } finally {
            setIsLoading(false)
        }
    }

    const handleRevealAnswer = async (answerId) => {
        try {
            const res = await API.post('/admin/action', {
                questionId: currentQuestion.id,
                answerToRevealId: answerId,
                reveal: true
            })
            console.log("Answer Reveal:", res);
            const updatedAnswers = answer.map(ans =>
                ans._id === answerId ? { ...ans, revealed: true } : ans
            )
            dispatch(setAnswer(updatedAnswers))
            const revealedAnswer = answer.find(ans => ans._id === answerId);
            if (revealedAnswer) {
                dispatch(addPoints(revealedAnswer.points));
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleAddStrike = async () => {
        try {
            const nextStrikeCount = strikeCount >= 3 ? 1 : strikeCount + 1;

            const res = await API.post('/admin/action', {
                strike: true,
                countStrike: nextStrikeCount,
            })
            console.log("Add strike:", res);
            setStrikeCount(nextStrikeCount)
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Box sx={{ py: 3 }}>
            {
                family.length > 0 ? (
                    <Container maxWidth="lg">
                        <Card sx={{ bgcolor: '#1e293b', color: 'white', border: '4px solid #fbbf24' }}>

                            <CardContent>
                                <Typography variant="h4" align="center" sx={{ color: '#fbbf24', fontWeight: 'bold', mb: 3 }}>
                                    Admin Panel
                                </Typography>

                                {
                                    isLoading ? (
                                        <Typography>Loadin ...</Typography>
                                    ) : (
                                        <>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: '#1e4ed8', p: 2, borderRadius: 2, mb: 3 }}>
                                                <Typography variant="h6">Current Question:</Typography>
                                                <Typography variant="body1" sx={{ mt: "4px" }}>{currentQuestion?.text}</Typography>
                                            </Box>

                                            {/* Team and Strikes Display */}
                                            <Box sx={{
                                                bgcolor: '#1e4ed8', p: 2, borderRadius: 2,
                                                mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                            }}>
                                                <Typography variant="h6">
                                                    Current Team: <span style={{ color: '#fbbf24' }}>Team 1</span>
                                                </Typography>

                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Typography variant="body1">Strikes:</Typography>
                                                        {[...Array(3)].map((_, index) => (
                                                            <Close
                                                                key={index}
                                                                sx={{
                                                                    color: index < strikeCount ? 'yellow' : 'rgba(255,255,255,0.3)',
                                                                    fontSize: 28
                                                                }}
                                                            />
                                                        ))}
                                                    </Box>

                                                    <Button
                                                        variant="contained"
                                                        // startIcon={<SwapHorizIcon />}
                                                        // onClick={handleSwitchTeam}
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

                                            <Grid2 container spacing={2}>
                                                {answer?.map((answer, index) => (
                                                    <Grid2 item size={{ xs: 12, md: 6 }} >
                                                        <Box sx={{
                                                            p: 1,
                                                            borderRadius: 2,
                                                            // bgcolor: '#1e4ed8',
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
                                                                    // startIcon={answer.revealed ? <CheckCircleIcon /> : null}
                                                                    onClick={() => handleRevealAnswer(answer._id)}
                                                                    disabled={answer.revealed}
                                                                    sx={{
                                                                        bgcolor: answer.revealed ? '#22c55e' : '#3b82f6',
                                                                        '&:hover': { bgcolor: answer.revealed ? '#22c55e' : '#2563eb' }
                                                                    }}
                                                                >
                                                                    {/* {answer.revealed ? 'Revealed' : 'Reveal'} */}
                                                                    Reveal
                                                                </Button>
                                                            </Box>
                                                        </Box>
                                                    </Grid2>
                                                ))}
                                            </Grid2>

                                            {/* Strike and next question Button */}
                                            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', mt: 4 }}>
                                                <Button
                                                    variant="contained"
                                                    startIcon={<Close />}
                                                    onClick={handleAddStrike}
                                                    // disabled={strikes >= 3}
                                                    sx={{
                                                        fontSize: '16px',
                                                        textTransform: 'capitalize',
                                                        bgcolor: '#b91c1c  '
                                                    }}
                                                >
                                                    Add Strike
                                                </Button>

                                                <Button
                                                    variant="contained"
                                                    onClick={handleNextQuestion}
                                                    sx={{
                                                        fontSize: '16px',
                                                        textTransform: 'capitalize',
                                                        bgcolor: '#fbbf24  '
                                                    }}
                                                >
                                                    Next Question
                                                </Button>
                                            </Box>
                                        </>
                                    )
                                }

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
                                        onChange={(event, newValue) => {
                                            setSelectedFamily1(newValue)
                                        }}
                                        inputValue={family1Input}
                                        onInputChange={(event, newInputValue) => {
                                            setFamily1Input(newInputValue)
                                        }}
                                        options={familyData}
                                        getOptionLabel={(option) => option?.name || ''}
                                        freeSolo
                                        optionEqualToValue={(option, value) => option._id === value?._id}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Enter first family"
                                            />
                                        )}
                                    />
                                </Grid2>

                                <Grid2 size={{ xs: 12, md: 6 }}>
                                    <Autocomplete
                                        value={selectedFamily2}
                                        onChange={(event, newValue) => {
                                            setSelectedFamily2(newValue)
                                        }}
                                        inputValue={family2Input}
                                        onInputChange={(event, newInputValue) => {
                                            setFamily2Input(newInputValue)
                                        }}
                                        options={familyData}
                                        getOptionLabel={(option) => option?.name || ''}
                                        freeSolo
                                        optionEqualToValue={(option, value) => option._id === value?._id}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Enter second family"
                                            />
                                        )}
                                    />
                                </Grid2>
                            </Grid2 >

                            <Box className='w-full flex justify-end mt-2'>
                                <button
                                    className='bg-blue-800 py-2 px-3 text-white rounded'
                                    onClick={handleCreateFamilies}
                                // disabled={!family1Input || !family2Input}
                                >
                                    Create Family
                                </button>
                            </Box>

                            <Box className='w-full flex justify-center mt-2'>
                                <button
                                    className='bg-blue-900 py-2 px-3 text-white rounded'
                                    onClick={handleStartGame}
                                // disabled={!family1Input || !family2Input}
                                >
                                    Start Game
                                </button>
                            </Box>

                        </Box >
                    </Container >
                )
            }

        </Box >
    )
}

export default AddFamily