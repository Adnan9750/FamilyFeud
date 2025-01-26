import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        family: [],
        question: {},
        answer: [],
        currentTeamIndex: 0,
        currentFamilyId: null,
        strikeCount: 0,
        gameStage: 'first_team', // 'first_team', 'second_team_chance'
        firstTeamStrikes: 0,
        secondTeamStrikes: 0,
        lastCorrectTeamIndex: 0
    },
    reducers: {
        setFamily: (state, action) => {
            state.family = action.payload.map((family, index) => ({
                ...family,
                points: 0,
                strikes: 0,
                teamOrder: index === 0 ? 'first' : 'second'
            }));
            state.gameStage = 'first_team';
            state.currentTeamIndex = 0;
            state.currentFamilyId = state.family[0]._id;
            state.firstTeamStrikes = 0;
            state.secondTeamStrikes = 0;
            state.lastCorrectTeamIndex = 0;
        },
        setCurrentFamilyId: (state, action) => {
            state.currentFamilyId = action.payload
        },
        setQuestion: (state, action) => {
            state.question = action.payload;
            state.answer = action.payload.answers.map(ans => ({
                ...ans,
                revealed: false
            }));
            state.gameStage = 'first_team';
            state.currentTeamIndex = 0;
            state.currentFamilyId = state.family[0]._id;
            state.firstTeamStrikes = 0;
            state.secondTeamStrikes = 0;
            state.strikeCount = 0;
        },
        
        addScore: (state, action) => {
            const { points } = action.payload;
            
            if (state.gameStage === 'first_team') {
                state.family[0].points += points;
            } 
            else if (state.gameStage === 'second_team_chance') {
                const firstTeamPoints = state.family[0].points;
                state.family[0].points = 0;
                state.family[1].points += firstTeamPoints + points;
                state.gameStage = 'first_team';
                // state.currentTeamIndex = 0;
                state.currentFamilyId = state.family[0]._id;
            }
        },
        addStrike: (state) => {
            if (state.gameStage === 'first_team') {
                state.firstTeamStrikes += 1;
                state.strikeCount += 1;

                if (state.firstTeamStrikes >= 3) {
                    state.gameStage = 'second_team_chance';
                    state.currentTeamIndex = 1;
                    state.currentFamilyId = state.family[1]._id;
                    state.strikeCount = 0
                }
            }
            else if (state.gameStage === 'second_team_chance') {
                state.secondTeamStrikes += 1;
                state.strikeCount += 1;

                // if (state.secondTeamStrikes >= 1) {
                //     // Close all remaining answers
                //     state.answer = state.answer.map(ans => ({
                //         ...ans,
                //         revealed: true
                //     }));
                // }
            }
        },
        switchTeam: (state) => {
            // Only allow switching if no strikes have been recorded for the current team
            if ((state.gameStage === 'first_team' && state.firstTeamStrikes === 0) ||
                (state.gameStage === 'second_team_chance' && state.secondTeamStrikes === 0)) {
                state.currentTeamIndex = state.currentTeamIndex === 0 ? 1 : 0;
                state.currentFamilyId = state.family[state.currentTeamIndex]._id;
            }
        },
        setAnswer: (state, action) => {
            state.answer = action.payload;
        },
        resetAll: (state) => {
            state.family = [];
            state.question = {};
            state.answer = [];
            state.currentTeamIndex = 0;
            state.currentFamilyId = null;
            state.strikeCount = 0;
            state.firstTeamStrikes = 0;
            state.secondTeamStrikes = 0;
            state.gameStage = 'first_team';
        }
    }
});

export const {
    setFamily,
    setCurrentFamilyId,
    setQuestion,
    setAnswer,
    addScore,
    switchTeam,
    addStrike,
    resetAll
} = adminSlice.actions;

export default adminSlice.reducer;