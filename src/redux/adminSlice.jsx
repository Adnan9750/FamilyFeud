import { createSlice } from "@reduxjs/toolkit";


const adminSlice = createSlice({
    name:'admin',
    initialState:{
        family:[],
        question:{},
        answer:[]
    },
    reducers: {
        setFamily: (state, action) => {
            state.family = action.payload
        },
        setQuestion: (state, action) => {
            state.question = action.payload
        },
        setAnswer: (state, action) => {
            state.answer = action.payload
        }
    }
})

export const { setFamily, setQuestion, setAnswer } = adminSlice.actions
export default adminSlice.reducer