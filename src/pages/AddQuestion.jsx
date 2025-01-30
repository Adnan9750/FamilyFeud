import { Alert, Box, Button, Container, Table, TableCell, TableContainer, TableHead, Typography } from '@mui/material'
import React, { useRef, useState } from 'react'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import setupAPI from '../services/Api';

const AddQuestion = () => {

  const fileRef = useRef(null)
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError(''); // Clear any previous errors
    }
  };

  const API = setupAPI()

  const handleUploadQuestion = async (e) => {
    e.preventDefault()

    if (!selectedFile) {
      setError('Please select a file');
      setTimeout(() => {
        setError('')
      }, 3000)
      return;
    }

    const isExcel = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(selectedFile.type);

    if (!isExcel) {
      setError('Please select only Excel files (.xls or .xlsx)');
      setTimeout(() => {
        setError('')
      }, 3000)
      return;
    }

    try {
      const res = await API.post('/survey/upload-Surveys', selectedFile)
      // upload-Surveys
    } catch (error) {

    }
  }

  return (
    <>
      <Box padding={4}>
        <Container>
          <Box >
            <form className='flex flex-col gap-10' onSubmit={handleUploadQuestion}>
              <Box className='flex flex-col gap-3'>
                <Typography variant='body1' fontWeight={600}>Format Of Question</Typography>
                <TableContainer>
                  <Table style={{ borderCollapse: "collapse" }} aria-label="striped sortable table">
                    <TableHead>
                      <TableCell>Question</TableCell>
                      <TableCell sx={{ minWidth: '100px' }}>Answer 1</TableCell>
                      <TableCell sx={{ minWidth: '100px' }}>Point 1</TableCell>
                      <TableCell sx={{ minWidth: '100px' }}>Answer 2</TableCell>
                      <TableCell sx={{ minWidth: '100px' }}>Point 2</TableCell>
                      <TableCell sx={{ minWidth: '100px' }}>Answer 3</TableCell>
                      <TableCell sx={{ minWidth: '100px' }}>Point 3</TableCell>
                      <TableCell sx={{ minWidth: '100px' }}>Answer 4</TableCell>
                      <TableCell sx={{ minWidth: '100px' }}>Point 4</TableCell>
                      <TableCell sx={{ minWidth: '100px' }}>Answer 5</TableCell>
                      <TableCell sx={{ minWidth: '100px' }}>Point 5</TableCell>
                      <TableCell sx={{ minWidth: '100px' }}>Answer 6</TableCell>
                      <TableCell sx={{ minWidth: '100px' }}>Point 6</TableCell>
                      <TableCell sx={{ minWidth: '100px' }}>Answer 7</TableCell>
                      <TableCell sx={{ minWidth: '100px' }}>Point 7</TableCell>
                      <TableCell sx={{ minWidth: '100px' }}>Answer 8</TableCell>
                      <TableCell sx={{ minWidth: '100px' }}>Point 8</TableCell>
                    </TableHead>
                  </Table>
                </TableContainer>
              </Box>

              {
                error && (
                  <Alert severity='error'>{error}</Alert>
                )
              }

              <Box className='py-16 border border-slate-900 rounded-lg flex justify-center '>
                <Box className='flex flex-col items-center gap-2'>
                  <CloudUploadOutlinedIcon sx={{ fontSize: '60px' }} />
                  <Typography onClick={() => fileRef.current.click()} variant='body1' sx={{ cursor: 'pointer', color: '#1d4ed8', fontWeight: 600 }}>
                    Browse
                  </Typography>
                  <Typography>{selectedFile?.name || ''}</Typography>
                  {/* <Typography variant='caption'>.xls</Typography> */}
                  <input
                    type='file'
                    ref={fileRef}
                    style={{ display: "none" }}
                    accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    onChange={handleFileChange}
                  />
                </Box>
              </Box>

              <Box className='flex justify-end'>
                <Button
                  type='submit'
                  // onClick={() => handleUploadQuestion()}
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
                    Upload Question
                  </Typography>
                </Button>
              </Box>
            </form>

          </Box>
        </Container>
      </Box>
    </>
  )
}

export default AddQuestion
