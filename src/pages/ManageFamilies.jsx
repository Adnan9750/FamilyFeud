import { Box, Button, Container, IconButton, Menu, MenuItem, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, ThemeProvider, Typography, createTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import setupAPI from '../services/Api'
import { MoreVert } from '@mui/icons-material';
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

const theme = createTheme({
    components: {
        MuiTable: {
            styleOverrides: {
                root: {
                    // borderCollapse: "collapse",
                    border: "none"
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    // padding: "8px 8px",//
                    color: '#515151',
                    border: "none"
                },
                head: {
                    fontWeight: 700,
                    color: '#212121'
                },
            },
        },
    },
});

const ManageFamilies = () => {

    const [familyData, setFamilyData] = useState([])
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [currentFamily, setCurrentFamily] = useState(null)
    const [deleteModal, setDeleteModal] = useState(false)
    const [updateModal, setUpdateModal] = useState(false)
    const [newName, setNewName] = useState('')

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

    useEffect(() => {
        fetchFamilies()
    }, [])

    const handleSelectedFamily = (event, currentFamily) => {
        setMenuAnchor(event.currentTarget)
        setCurrentFamily(currentFamily)
        setNewName(currentFamily?.name)
    }

    const handleEdit = async () => {
        try {
            const res = await API.post('/family/update-family', {
                familyId: currentFamily?._id,
                newName: newName
            })

            fetchFamilies()

            setMenuAnchor(null)
            setUpdateModal(false)
            setCurrentFamily(null)
        } catch (error) {
            console.log(error);
        }
    }

    const handleDelete = async () => {
        try {
            const res = await API.delete(`/family/delete-family/${currentFamily?._id}`)

            setFamilyData(prevData =>
                prevData.filter(family => family._id !== currentFamily?._id)
            )
            // Close menu and modal
            setMenuAnchor(null)
            setDeleteModal(false)
            setCurrentFamily(null)
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            {/* <ThemeProvider theme={theme}> */}
                <Box padding={4}>
                    <Container>
                        <Box className='flex flex-col gap-5'>
                            <Paper>
                                <Box className='py-4 px-3 flex items-center justify-between'>
                                    <Typography variant='h6'>Manage Families</Typography>

                                    {/* <button className='border border-[#1d4ed8] py-2 px-3 rounded-md'>
                                        <Typography variant='body2'>Add Family</Typography>
                                    </button> */}
                                </Box>
                            </Paper>
                            <Paper>
                                <TableContainer>
                                    <Table style={{ borderCollapse: "collapse" }} aria-label="striped sortable table">
                                        <TableHead>
                                            <TableCell>Name</TableCell>
                                            <TableCell align='center'>Game Played</TableCell>
                                            <TableCell align='center'>Game Won</TableCell>
                                            <TableCell align='center'>Actions</TableCell>
                                        </TableHead>

                                        <TableBody>
                                            {
                                                familyData?.map((currFamily) => (
                                                    <TableRow key={currFamily._id}>
                                                        <TableCell>{currFamily.name || '--'}</TableCell>
                                                        <TableCell align='center'>{currFamily.gamesPlayed}</TableCell>
                                                        <TableCell align='center'>{currFamily.gamesWon}</TableCell>
                                                        <TableCell align='center'>
                                                            <IconButton onClick={(event) => handleSelectedFamily(event, currFamily)}>
                                                                <MoreVert />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            }

                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Box>
                    </Container>
                </Box>
            {/* </ThemeProvider> */}

            <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={() => { setMenuAnchor(null), setCurrentFamily(null) }}
            >
                {/* <MenuItem onClick={handleViewDetails} sx={{ fontSize: "14px" }}>
                    View Details
                </MenuItem> */}
                <MenuItem
                    onClick={() => { setUpdateModal(true), setMenuAnchor(null) }}
                    sx={{ fontSize: "14px" }}
                >
                    Edit
                </MenuItem>

                <MenuItem
                    onClick={() => { setDeleteModal(true), setMenuAnchor(null) }}
                    sx={{ fontSize: "14px" }}
                >
                    Delete
                </MenuItem>
            </Menu>

            <Modal
                open={updateModal}
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "10px",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "30px",
                        bgcolor: "#FFFFFF",
                        width: "370px",
                        maxWidth: "370px",
                        height: "200px",
                        borderRadius: "12px",
                        padding: "30px 20px",
                    }}
                >
                    <TextField
                        name="newName"
                        value={newName}
                        placeholder='Enter Family Name'
                        onChange={(e) => setNewName(e.target.value)}
                    />
                    <Box>
                        <Box sx={{ display: "flex", justifyContent: "center", gap: "12px" }}>
                            <Button
                                onClick={() => { setUpdateModal(false); }}
                                sx={{ color: "#1d4ed8", textTransform: "capitalize" }}
                            >
                                <Typography variant="body1" fontWeight={500}>
                                    Cancel
                                </Typography>
                            </Button>
                            <Button
                                onClick={handleEdit}
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
                                    Edit
                                </Typography>
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>

            <Modal
                open={deleteModal}
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "10px",
                }}
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
                        <Typography variant="h6" fontWeight={500}>
                            Are you sure?
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Typography
                            textAlign="center"
                            fontSize="18px"
                            fontWeight={500}
                            sx={{ color: "#94A3B8" }}
                        >
                            Do you want to delete {`${currentFamily?.name}`}
                            {/* {t('do_you_really_want_to_delete_this')} */}
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "center", gap: "12px" }}>
                        <Button
                            onClick={() => { setDeleteModal(false); }}
                            sx={{ color: "#1d4ed8", textTransform: "capitalize" }}
                        >
                            <Typography variant="body1" fontWeight={500}>
                                Cancel
                            </Typography>
                        </Button>
                        <Button
                            onClick={() => handleDelete()}
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
                                Ok
                            </Typography>
                        </Button>
                    </Box>
                </Box>
            </Modal>

        </>
    )
}

export default ManageFamilies
