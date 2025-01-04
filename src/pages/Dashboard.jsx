import { Box, Container, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';

const Dashboard = () => {
    // Mock API data (replace this with API fetch later)
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        // Simulate API call and update state
        setTimeout(() => {
            setAnswers([
                { number: 1, text: "Answer 1", percentage: "72%" },
            ]);
        }, 2000);
        setTimeout(() => {
            setAnswers([
                { number: 1, text: "Answer 1", percentage: "72%" },
                { number: 4, text: "Answer 4", percentage: "45%" },
            ]);
        }, 4000);
        setTimeout(() => {
            setAnswers([
                { number: 1, text: "Answer 1", percentage: "72%" },
                { number: 4, text: "Answer 4", percentage: "45%" },
                { number: 6, text: "Answer 6", percentage: "31%" }
            ]);
        }, 6000);
    }, []);

    // Define the total number of boxes
    const totalBoxes = 8;

    return (
        <>
            <Box className="w-full bg-blue-500 h-screen py-5">
                <Container
                    maxWidth="lg"
                    sx={{
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
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
                                const answer = answers.find(a => a.number === index + 1);
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
                                            <Box className='border border-blue-300 w-full h-full rounded-lg flex items-center justify-center'>
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
                                const answer = answers.find(a => a.number === index + 5);
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
                                            <Box className='border border-blue-300 w-full h-full rounded-lg flex items-center justify-center'>
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
