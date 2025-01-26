import { Box, Button, Container, Paper, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import setupAPI from '../services/Api'
import { useNavigate } from 'react-router-dom'

const Login = () => {

    const navigate = useNavigate()
    const [formData,setFormData] = useState({
        username:'',
        password:''
    })

    const handleChange = (e) => {
        const {name,value} = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    }

    const API = setupAPI()

    const handleLogin = async(e) =>{
        e.preventDefault()
        try {
            const res = await API.post('/admin/login',formData)
            navigate('/playGame')
        } catch (error) {
            console.log();
        }
    }

    return (
        <>
            {/* <Box> */}
            <Box sx={{
                display: 'flex',           // Enables Flexbox
                justifyContent: 'center',  // Centers horizontally
                alignItems: 'center',      // Centers vertically
                minHeight: '100vh',        // Sets height to the full viewport
                backgroundColor: '#f5f5f5' // Optional background color
            }}>
                <Container maxWidth='sm'>
                    <Paper>
                        <Typography variant='h5' sx={{ padding: '1rem 0rem 1rem 0rem', textAlign: 'center' }}>
                            Login
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, padding: '1.5rem 3rem' }}>
                            <TextField
                                fullWidth
                                name='username'
                                value={formData.username}
                                placeholder="Enter Your Name"
                                onChange={handleChange}
                            />
                            <TextField
                                fullWidth
                                name='password'
                                value={formData.password}
                                placeholder="Enter Your Password"
                                onChange={handleChange}
                            />
                        </Box>

                        <Box className='flex justify-center pb-5'>
                            <Button
                                onClick={handleLogin}
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
                                    Login
                                </Typography>
                            </Button>
                            
                        </Box>
                    </Paper>
                </Container>
            </Box>
            {/* </Box> */}
        </>
    )
}

export default Login
