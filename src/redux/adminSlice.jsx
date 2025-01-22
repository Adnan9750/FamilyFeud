import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        family: [],
        question: {},
        answer: [],
        currentTeamIndex: 0
    },
    reducers: {
        setFamily: (state, action) => {
            // Setting families with initial scores
            state.family = action.payload.map(family => ({
                ...family,
                points: 0, 
            }))
        },
        setQuestion: (state, action) => {
            state.question = action.payload;
        },
        setAnswer: (state, action) => {
            state.answer = action.payload;
        },
        addScore: (state, action) => {
            console.log("option score:", action.payload);
            // Add points to current team's currentScore
            if (state.family[state.currentTeamIndex]) {
                state.family[state.currentTeamIndex].points += action.payload.points;
            }
        },
        switchTeam: (state, action) => {
            const currentScore = state.family[state.currentTeamIndex].points;

            // Reset current team's score to 0
            state.family[state.currentTeamIndex].points = 0;

            // Switch to other team
            state.currentTeamIndex = state.currentTeamIndex === 0 ? 1 : 0;

            // If transferScore is true, add the previous team's score to the new team
            if (action.payload?.transferScore) {
                state.family[state.currentTeamIndex].points += currentScore;
            }
        }
        // switchTeam: (state) => {
        //     state.currentTeamIndex = state.currentTeamIndex === 0 ? 1 : 0;
        // }
    }
});

export const {
    setFamily,
    setQuestion,
    setAnswer,
    addScore,
    switchTeam
} = adminSlice.actions;

export default adminSlice.reducer;