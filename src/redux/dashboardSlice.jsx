import { createSlice } from "@reduxjs/toolkit";


const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        family: [],
        question: {},
        answers: []
    },
    reducers: {
        setFamily: (state, action) => {
            state.family = action.payload
        },
        setQuestion: (state, action) => {
            state.question = action.payload
        },
        setAnswer: (state, action) => {
            state.answers = action.payload
        }
    }
})

export const { setFamily, setQuestion, setAnswer } = dashboardSlice.actions
export default dashboardSlice.reducer