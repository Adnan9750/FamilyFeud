import { Box, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import setupAPI from '../services/Api'

const LeaderBoard = () => {

    const [boardData, setLeaderBoardData] = useState([])

    const API = setupAPI()

    const fetchLeaderBoardData = async () => {
        try {
            const res = await API.get('/admin/get-leaderboard')
            console.log("LeaderBoard Data", res);
            setLeaderBoardData(res?.data?.leaderboard)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchLeaderBoardData()
    }, [])
    return (
        <>
            <Box className='w-full bg-blue-500'>
                <Box className="min-h-screen pt-4">
                    <Container>
                        <Box className='py-4'>
                            <Typography color='#fff' variant='h5' textAlign='center'>LeaderBoard</Typography>
                        </Box>
                        <Paper sx={{ bgcolor: '#3b82f6',border: '3px solid yellow' }}>
                            <TableContainer>
                                <Table style={{ borderCollapse: "collapse" }} aria-label="striped sortable table">
                                    <TableHead>
                                        <TableCell sx={{ color: '#ffff', fontWeight: 600, fontSize: '14px' }}>Name</TableCell>
                                        <TableCell sx={{ color: '#ffff', fontWeight: 600, fontSize: '14px' }} align='center'>Game Played</TableCell>
                                        <TableCell sx={{ color: '#ffff', fontWeight: 600, fontSize: '14px' }} align='center'>Game Won</TableCell>
                                        <TableCell sx={{ color: '#ffff', fontWeight: 600, fontSize: '14px' }} align='center'>Win Percentage</TableCell>
                                        {/* <TableCell sx={{ color: '#ffff', fontWeight: 600, fontSize: '14px' }} align='center'>Actions</TableCell> */}
                                    </TableHead>

                                    <TableBody>
                                        {
                                            boardData?.map((board) => (
                                                <TableRow key={board._id}>
                                                    <TableCell sx={{ color: '#ffff', fontWeight: 400, fontSize: '12px' }}>
                                                        {board.name}
                                                    </TableCell>
                                                    <TableCell sx={{ color: '#ffff', fontWeight: 400, fontSize: '12px' }} align='center'>
                                                        {board.gamesPlayed}
                                                    </TableCell>
                                                    <TableCell sx={{ color: '#ffff', fontWeight: 400, fontSize: '12px' }} align='center'>
                                                        {board.gamesWon}
                                                    </TableCell>
                                                    <TableCell sx={{ color: '#ffff', fontWeight: 400, fontSize: '12px' }} align='center'>
                                                        {`${board.winPercentage}%`}
                                                    </TableCell>
                                                    {/* <TableCell sx={{ color: '#ffff', fontWeight: 400, fontSize: '12px' }} align='center'>Actions</TableCell> */}
                                                </TableRow>
                                            ))
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Container>
                </Box>
            </Box>
        </>
    )
}

export default LeaderBoard
