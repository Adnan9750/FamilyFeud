import { Box, Container, Grid, Grid2, Typography } from '@mui/material';
import React from 'react';

const Example = () => {

    const answers = [
        { number: 1, text: "Answer 1", percentage: "72%" },
        { number: 2, text: "Answer 2", percentage: "65%" },
        { number: 3, text: "Answer 3", percentage: "58%" },
        { number: 4, text: "Answer 4", percentage: "45%" },
        { number: 5, text: "Answer 5", percentage: "39%" },
        { number: 6, text: "Answer 6", percentage: "31%" }
    ];

    return (
        <>
            <Box className="w-full bg-blue-500 min-h-screen py-5">
                <Container
                    maxWidth="lg"
                    sx={{
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Grid2
                        container
                        spacing={3}
                        sx={{ width: '100%' }}
                    >
                        <Grid2 item xs={12} md={6}>
                            {/* Left Column */}
                            {[0, 1, 2, 3].map((index) => (
                                <Box
                                    key={index}
                                    className={` rounded-lg border-2 border-blue-300 mb-3 
                                    ${index < answers.length ? 'bg-blue-600' : 'bg-blue-900/50'
                                        }`}
                                    sx={{
                                        height: '64px',
                                        position: 'relative',
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '0 16px',
                                    }}
                                >
                                    {index < answers.length && (
                                        <>
                                            <Box
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: '50%',
                                                    backgroundColor: 'rgba(0,0,0,0.3)',
                                                    border: '2px solid',
                                                    borderColor: 'primary.light',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    marginRight: 2
                                                }}
                                            >
                                                <Typography
                                                    variant="h6"
                                                    sx={{ color: 'white' }}
                                                >
                                                    {answers[index].number}
                                                </Typography>
                                            </Box>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    color: 'white',
                                                    flexGrow: 1
                                                }}
                                            >
                                                {answers[index].text}
                                            </Typography>
                                            <Typography
                                                variant="h6"
                                                sx={{ color: 'white' }}
                                            >
                                                {answers[index].percentage}
                                            </Typography>
                                        </>
                                    )}
                                </Box>
                            ))}
                        </Grid2>

                        <Grid2 item xs={12} md={6}>
                            {/* Right Column */}
                            {[4, 5, 6, 7].map((index) => (
                                <Box
                                    key={index}
                                    className={`rounded-lg border-2 border-blue-300 mb-3 ${index < answers.length ? 'bg-blue-600' : 'bg-blue-900/50'
                                        }`}
                                    sx={{
                                        height: '64px',
                                        position: 'relative',
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '0 16px',
                                    }}
                                >
                                    {index < answers.length && (
                                        <>
                                            <Box
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: '50%',
                                                    backgroundColor: 'rgba(0,0,0,0.3)',
                                                    border: '2px solid',
                                                    borderColor: 'primary.light',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    marginRight: 2
                                                }}
                                            >
                                                <Typography
                                                    variant="h6"
                                                    sx={{ color: 'white' }}
                                                >
                                                    {answers[index].number}
                                                </Typography>
                                            </Box>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    color: 'white',
                                                    flexGrow: 1
                                                }}
                                            >
                                                {answers[index].text}
                                            </Typography>
                                            <Typography
                                                variant="h6"
                                                sx={{ color: 'white' }}
                                            >
                                                {answers[index].percentage}
                                            </Typography>
                                        </>
                                    )}
                                </Box>
                            ))}
                        </Grid2>
                    </Grid2>
                </Container>
            </Box>
        </>
    )
}

export default Example
