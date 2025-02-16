import { Alert, Box, Button, Container, Grid2, InputLabel, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import setupAPI from '../services/Api'

const AddQuestionManual = () => {

    const [success, setSuccess] = useState('')
    const [addQuestion, setAddQuestion] = useState({
        question: '',
        answers: []
    })
    const [errors, setErrors] = useState({
        question: '',
        answers: ''
    })

    const validateForm = () => {
        let isValid = true
        const newErrors = { question: '', answers: '' }

        // Validate question
        if (!addQuestion.question.trim()) {
            newErrors.question = 'Question is required'
            isValid = false
        }

        // Count valid answers (both text and points filled)
        const validAnswersCount = addQuestion.answers.filter(answer =>
            answer?.text?.trim() && answer?.points?.toString().trim()
        ).length

        // Validate minimum 3 answers
        if (validAnswersCount < 3) {
            newErrors.answers = 'At least 3 complete answers are required'
            isValid = false
        }

        setErrors(newErrors)

        setTimeout(() => {
            setErrors({ question: '', answers: '' })
        }, 3000);
        
        return isValid
    }

    const handleQuestionChange = (e) => {
        setAddQuestion(prev => ({
            ...prev,
            question: e.target.value
        }))
        if (errors.question) {
            setErrors(prev => ({ ...prev, question: '' }))
        }
    }

    const handleAnswerChange = (index, field, value) => {
        setAddQuestion(prev => {
            const newAnswers = [...prev.answers]
            if (!newAnswers[index]) {
                newAnswers[index] = {}
            }
            newAnswers[index] = {
                ...newAnswers[index],
                [field]: value
            }
            return {
                ...prev,
                answers: newAnswers
            }
        })
        if (errors.answers) {
            setErrors(prev => ({ ...prev, answers: '' }))
        }
    }

    const API = setupAPI()

    const handleAddQuestion = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        // Filter out incomplete answers
        const validAnswers = addQuestion.answers.filter(answer =>
            answer && answer.text && answer.points
        )

        const formData = {
            question: addQuestion.question,
            answers: validAnswers
        }

        const res = await API.post('/survey/add-questions', { questions: [formData] })
        console.log("Question Uploaded:", res);

        setSuccess(res?.data?.message)

        setTimeout(() => {
            setSuccess('')
        }, 3000)

        // console.log('Form Data:', formData)

        // Reset form
        setAddQuestion({
            question: '',
            answers: []
        })
        setErrors({ question: '', answers: '' })
    }

    return (
        <>
            <Container>
                <form className='w-full' onSubmit={handleAddQuestion}>
                    <Grid2 container spacing={3}>
                        <Grid2 size={{ xs: 12 }}>
                            <Box className='flex flex-col gap-1'>
                                <InputLabel>
                                    Question <span style={{ color: 'red' }}>*</span>
                                </InputLabel>
                                <TextField
                                    fullWidth
                                    placeholder='Enter Question'
                                    value={addQuestion.question}
                                    onChange={handleQuestionChange}
                                    error={!!errors.question}
                                    helperText={errors.question}
                                />
                            </Box>
                        </Grid2>

                        {
                            success && (
                                <Alert severity='success'>{success}</Alert>
                            )
                        }

                        {errors.answers && (
                            <Grid2 size={{ xs: 12 }}>
                                {/* <Typography color="error" variant="body2"> */}
                                <Alert severity='error'>{errors.answers}</Alert>
                                {/* {errors.answers} */}
                                {/* </Typography> */}
                            </Grid2>
                        )}

                        {/* first answer */}
                        <Grid2 size={{ xs: 12 }}>
                            <InputLabel>
                                First Answer
                            </InputLabel>
                        </Grid2>
                        <Grid2 size={{ xs: 12, md: 6 }}>
                            <Box className='flex flex-col gap-1'>
                                <TextField
                                    fullWidth
                                    placeholder='First answer text'
                                    value={addQuestion.answers[0]?.text || ''}
                                    onChange={(e) => handleAnswerChange(0, 'text', e.target.value)}
                                />
                            </Box>
                        </Grid2>
                        <Grid2 size={{ xs: 12, md: 6 }}>
                            <Box className='flex flex-col gap-1'>
                                <TextField
                                    fullWidth
                                    type="number"
                                    placeholder='First answer point'
                                    value={addQuestion.answers[0]?.points || ''}
                                    onChange={(e) => handleAnswerChange(0, 'points', e.target.value)}
                                />
                            </Box>
                        </Grid2>

                        {/* second answer */}
                        <Grid2 size={{ xs: 12 }}>
                            <InputLabel>
                                Second Answer
                            </InputLabel>
                        </Grid2>
                        <Grid2 size={{ xs: 12, md: 6 }}>
                            <Box className='flex flex-col gap-1'>
                                <TextField
                                    fullWidth
                                    placeholder='Second answer text'
                                    value={addQuestion.answers[1]?.text || ''}
                                    onChange={(e) => handleAnswerChange(1, 'text', e.target.value)}
                                />
                            </Box>
                        </Grid2>
                        <Grid2 size={{ xs: 12, md: 6 }}>
                            <Box className='flex flex-col gap-1'>
                                <TextField
                                    fullWidth
                                    type="number"
                                    placeholder='Second answer point'
                                    value={addQuestion.answers[1]?.points || ''}
                                    onChange={(e) => handleAnswerChange(1, 'points', e.target.value)}
                                />
                            </Box>
                        </Grid2>

                        {/* Third answer */}
                        <Grid2 size={{ xs: 12 }}>
                            <InputLabel>
                                Third Answer
                            </InputLabel>
                        </Grid2>
                        <Grid2 size={{ xs: 12, md: 6 }}>
                            <Box className='flex flex-col gap-1'>
                                <TextField
                                    fullWidth
                                    placeholder='Third answer text'
                                    value={addQuestion.answers[2]?.text || ''}
                                    onChange={(e) => handleAnswerChange(2, 'text', e.target.value)}
                                />
                            </Box>
                        </Grid2>
                        <Grid2 size={{ xs: 12, md: 6 }}>
                            <Box className='flex flex-col gap-1'>
                                <TextField
                                    fullWidth
                                    type="number"
                                    placeholder='Third answer point'
                                    value={addQuestion.answers[2]?.points || ''}
                                    onChange={(e) => handleAnswerChange(2, 'points', e.target.value)}
                                />
                            </Box>
                        </Grid2>

                        {/* Four answer */}
                        <Grid2 size={{ xs: 12 }}>
                            <InputLabel>
                                Four Answer
                            </InputLabel>
                        </Grid2>
                        <Grid2 size={{ xs: 12, md: 6 }}>
                            <Box className='flex flex-col gap-1'>
                                <TextField
                                    fullWidth
                                    placeholder='Four answer text'
                                    value={addQuestion.answers[3]?.text || ''}
                                    onChange={(e) => handleAnswerChange(3, 'text', e.target.value)}
                                />
                            </Box>
                        </Grid2>
                        <Grid2 size={{ xs: 12, md: 6 }}>
                            <Box className='flex flex-col gap-1'>
                                <TextField
                                    fullWidth
                                    type="number"
                                    placeholder='Four answer point'
                                    value={addQuestion.answers[3]?.points || ''}
                                    onChange={(e) => handleAnswerChange(3, 'points', e.target.value)}
                                />
                            </Box>
                        </Grid2>

                        {/* Five answer */}
                        <Grid2 size={{ xs: 12 }}>
                            <InputLabel>
                                Five Answer
                            </InputLabel>
                        </Grid2>
                        <Grid2 size={{ xs: 12, md: 6 }}>
                            <Box className='flex flex-col gap-1'>
                                <TextField
                                    fullWidth
                                    placeholder='Five answer text'
                                    value={addQuestion.answers[4]?.text || ''}
                                    onChange={(e) => handleAnswerChange(4, 'text', e.target.value)}
                                />
                            </Box>
                        </Grid2>
                        <Grid2 size={{ xs: 12, md: 6 }}>
                            <Box className='flex flex-col gap-1'>
                                <TextField
                                    fullWidth
                                    type="number"
                                    placeholder='Five answer point'
                                    value={addQuestion.answers[4]?.points || ''}
                                    onChange={(e) => handleAnswerChange(4, 'points', e.target.value)}
                                />
                            </Box>
                        </Grid2>

                        {/* Six answer */}
                        <Grid2 size={{ xs: 12 }}>
                            <InputLabel>
                                Six Answer
                            </InputLabel>
                        </Grid2>
                        <Grid2 size={{ xs: 12, md: 6 }}>
                            <Box className='flex flex-col gap-1'>
                                <TextField
                                    fullWidth
                                    placeholder='Six answer text'
                                    value={addQuestion.answers[5]?.text || ''}
                                    onChange={(e) => handleAnswerChange(5, 'text', e.target.value)}
                                />
                            </Box>
                        </Grid2>
                        <Grid2 size={{ xs: 12, md: 6 }}>
                            <Box className='flex flex-col gap-1'>
                                <TextField
                                    fullWidth
                                    type="number"
                                    placeholder='Six answer point'
                                    value={addQuestion.answers[5]?.points || ''}
                                    onChange={(e) => handleAnswerChange(5, 'points', e.target.value)}
                                />
                            </Box>
                        </Grid2>

                        {/* Seven answer */}
                        <Grid2 size={{ xs: 12 }}>
                            <InputLabel>
                                Seven Answer
                            </InputLabel>
                        </Grid2>
                        <Grid2 size={{ xs: 12, md: 6 }}>
                            <Box className='flex flex-col gap-1'>
                                <TextField
                                    fullWidth
                                    placeholder='Seven answer text'
                                    value={addQuestion.answers[6]?.text || ''}
                                    onChange={(e) => handleAnswerChange(6, 'text', e.target.value)}
                                />
                            </Box>
                        </Grid2>
                        <Grid2 size={{ xs: 12, md: 6 }}>
                            <Box className='flex flex-col gap-1'>
                                <TextField
                                    fullWidth
                                    type="number"
                                    placeholder='Seven answer point'
                                    value={addQuestion.answers[6]?.points || ''}
                                    onChange={(e) => handleAnswerChange(6, 'points', e.target.value)}
                                />
                            </Box>
                        </Grid2>

                        {/* Eight answer */}
                        <Grid2 size={{ xs: 12 }}>
                            <InputLabel>
                                Eight Answer
                            </InputLabel>
                        </Grid2>
                        <Grid2 size={{ xs: 12, md: 6 }}>
                            <Box className='flex flex-col gap-1'>
                                <TextField
                                    fullWidth
                                    placeholder='Eight answer text'
                                    value={addQuestion.answers[7]?.text || ''}
                                    onChange={(e) => handleAnswerChange(7, 'text', e.target.value)}
                                />
                            </Box>
                        </Grid2>
                        <Grid2 size={{ xs: 12, md: 6 }}>
                            <Box className='flex flex-col gap-1'>
                                <TextField
                                    fullWidth
                                    type="number"
                                    placeholder='Eight answer point'
                                    value={addQuestion.answers[7]?.points || ''}
                                    onChange={(e) => handleAnswerChange(7, 'points', e.target.value)}
                                />
                            </Box>
                        </Grid2>
                    </Grid2>

                    <Box className='flex justify-end mt-5'>
                        <Button
                            type='submit'
                            variant="contained"
                            disableElevation
                            sx={{
                                bgcolor: "#1d4ed8",
                                borderRadius: "8px",
                                textTransform: "capitalize",
                                "&:hover": {
                                    bgcolor: "#1d4ed8",
                                },
                            }}
                        >
                            <Typography variant="body1" fontWeight={500}>
                                Add Question
                            </Typography>
                        </Button>
                    </Box>
                </form>
            </Container>
        </>
    )
}

export default AddQuestionManual