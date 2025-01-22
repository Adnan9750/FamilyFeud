import { createSlice } from "@reduxjs/toolkit";


const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        family: [],
        question: {},
        answers: [],
        point: '',
        currentTeamIndex: 0
    },
    reducers: {
        setFamily: (state, action) => {
            state.family = action.payload.map(family => ({
                ...family,
                points: 0,
            }))
        },
        setQuestion: (state, action) => {
            state.question = action.payload
        },
        setAnswer: (state, action) => {
            state.answers = action.payload
        },
        setCurrentPoints: (state, action) => {
            state.point = action.payload
        },
        addScore: (state, action) => {
            console.log("option score:", action.payload);
            // Add points to current team's currentScore
            if (state.family[state.currentTeamIndex]) {
                state.family[state.currentTeamIndex].points += action.payload;
            }
        },
        switchTeam: (state, action) => {
            const currentScore = state.family[state.currentTeamIndex].points;

            state.family[state.currentTeamIndex].points = 0;

            state.currentTeamIndex = state.currentTeamIndex === 0 ? 1 : 0;

            if (action.payload?.transferScore) {
                state.family[state.currentTeamIndex].points += currentScore;
            }
        },
        resetAnswer: (state) => {
            state.answers = [],
            state.question = {}
        }
    }
})

export const { setFamily, setQuestion, setAnswer, resetAnswer, addScore, switchTeam, setCurrentPoints } = dashboardSlice.actions
export default dashboardSlice.reducer