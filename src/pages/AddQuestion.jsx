import { Alert, Box, Button, Container, Table, TableBody, TableCell, TableContainer, TableHead, Typography } from '@mui/material'
import React, { useRef, useState } from 'react'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import setupAPI from '../services/Api';

const AddQuestion = () => {

  const fileRef = useRef(null)
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('')

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
      const formData = new FormData()

      formData.append('file', selectedFile)

      const res = await API.post('/survey/upload-Surveys', formData)
      // console.log("Uploa file:", res);
      setSuccess(res?.data?.message)
      setTimeout(() => {
        setSuccess('')
      }, 3000)
      // upload-Surveys
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Box padding={4}>
        <Container>
          <Box >
            <form className='flex flex-col gap-10' onSubmit={handleUploadQuestion}>
              <Box className='flex flex-col gap-4'>
                <Typography variant='body1' fontWeight={600}>Format Of Question:</Typography>
                <TableContainer>
                  <Table style={{ borderCollapse: "collapse" }} aria-label="striped sortable table">
                    <TableHead>
                      <TableCell sx={{ minWidth: '150px' }}>Question</TableCell>
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

                    <TableBody>
                      <TableCell sx={{ minWidth: '150px' }}>Name a place where people try to be quiet.</TableCell>
                      <TableCell sx={{ minWidth: '100px' }}>Library</TableCell>
                      <TableCell sx={{ minWidth: '100px' }}>35</TableCell>
                      <TableCell sx={{ minWidth: '100px' }}>Church</TableCell>
                      <TableCell sx={{ minWidth: '100px' }}>20</TableCell>
                      <TableCell sx={{ minWidth: '100px' }}>Movie theater</TableCell>
                      <TableCell sx={{ minWidth: '100px' }}>15</TableCell>
                      <TableCell sx={{ minWidth: '100px' }}>Hospital</TableCell>
                      <TableCell sx={{ minWidth: '100px' }}>10</TableCell>
                      <TableCell sx={{ minWidth: '100px' }}>Classroom</TableCell>
                      <TableCell sx={{ minWidth: '100px' }}>8</TableCell>
                      <TableCell sx={{ minWidth: '100px' }}>Office</TableCell>
                      <TableCell sx={{ minWidth: '100px' }}>5</TableCell>
                      <TableCell sx={{ minWidth: '100px' }}>Courtroom</TableCell>
                      <TableCell sx={{ minWidth: '100px' }}>4</TableCell>
                      <TableCell sx={{ minWidth: '100px' }}>Baby’s room</TableCell>
                      <TableCell sx={{ minWidth: '100px' }}>3</TableCell>
                    </TableBody>

                  </Table>
                </TableContainer>
              </Box>

              {
                error && (
                  <Alert severity='error'>{error}</Alert>
                )
              }
              {
                success && (
                  <Alert severity='success'>{success}</Alert>
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
                    name='file'
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
