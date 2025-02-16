import { Box, Tab, Tabs, Typography } from '@mui/material'
import React, { useState } from 'react'
import AddQuestionFile from './AddQuestionFile'
import AddQuestionManual from './AddQuestionManual'

const GameQuestion = () => {

    const [activeTab, setActiveTab] = useState('file')

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue)
    }


    return (
        <>
            <Box padding={4}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    sx={{
                        my: 3,
                        "& .Mui-selected": {
                            fontWeight: "bold",
                        },
                    }}
                >
                    <Tab label="By File" value='file' />
                    <Tab label="By Manual" value='manual' />
                </Tabs>

                {
                    activeTab === 'file' && <AddQuestionFile/>
                }
                {
                    activeTab === 'manual' && <AddQuestionManual/>
                }
            </Box>
        </>
    )
}

export default GameQuestion
