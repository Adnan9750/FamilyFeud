import { Box, Container, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import setupAPI from '../services/Api'

const LeaderBoard = () => {

    const [boardData, setLeaderBoardData] = useState([])
    const [loading, setLoading] = useState(false)

    const API = setupAPI()

    const fetchLeaderBoardData = async () => {
        setLoading(true)
        try {
            const res = await API.get('/admin/get-leaderboard')
            console.log("LeaderBoard Data", res);
            setLeaderBoardData(res?.data?.leaderboard)
        } catch (error) {
            console.log(error);
            setLoading(false)
        } finally {
            setLoading(false)
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
                        <Paper sx={{ bgcolor: '#172554 ', border: '2px solid yellow' }}>
                            <TableContainer>
                                <Table style={{ borderCollapse: "collapse" }} aria-label="striped sortable table">
                                    <TableHead>
                                        <TableCell sx={{ color: '#ffff', fontWeight: 600, fontSize: '16px' }}>Name</TableCell>
                                        <TableCell sx={{ color: '#ffff', fontWeight: 600, fontSize: '16px' }} align='center'>Games Played</TableCell>
                                        <TableCell sx={{ color: '#ffff', fontWeight: 600, fontSize: '16px' }} align='center'>Games Won</TableCell>
                                        <TableCell sx={{ color: '#ffff', fontWeight: 600, fontSize: '16px' }} align='center'>Score</TableCell>
                                        <TableCell sx={{ color: '#ffff', fontWeight: 600, fontSize: '16px' }} align='center'>Win Percentage</TableCell>
                                        {/* <TableCell sx={{ color: '#ffff', fontWeight: 600, fontSize: '14px' }} align='center'>Actions</TableCell> */}
                                    </TableHead>

                                    {
                                        loading ? (
                                            <Typography color='#fff' textAlign='center'>Loading ...</Typography>
                                        ) : (
                                            <TableBody>
                                                {
                                                    boardData?.map((board) => (
                                                        <TableRow key={board._id} sx={{border:'1px solid #fff'}}>
                                                            <TableCell sx={{ color: '#ffff', fontWeight: 400, fontSize: '14px' }}>
                                                                {board.name}
                                                            </TableCell>
                                                            <TableCell sx={{ color: '#ffff', fontWeight: 400, fontSize: '14px' }} align='center'>
                                                                {board.gamesPlayed}
                                                            </TableCell>
                                                            <TableCell sx={{ color: '#ffff', fontWeight: 400, fontSize: '14px' }} align='center'>
                                                                {board.gamesWon}
                                                            </TableCell>
                                                            <TableCell sx={{ color: '#ffff', fontWeight: 400, fontSize: '14px' }} align='center'>
                                                                {board.score}
                                                            </TableCell>
                                                            <TableCell sx={{ color: '#ffff', fontWeight: 400, fontSize: '14px' }} align='center'>
                                                                {`${board.winPercentage}%`}
                                                            </TableCell>
                                                            {/* <TableCell sx={{ color: '#ffff', fontWeight: 400, fontSize: '12px' }} align='center'>Actions</TableCell> */}
                                                        </TableRow>
                                                    ))
                                                }
                                            </TableBody>
                                        )
                                    }
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
