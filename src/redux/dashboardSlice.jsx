import { createSlice } from "@reduxjs/toolkit";

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        family: [],
        question: null,
        answers: [],
        familyTurn: '', // Current team's turn
        point: '',
        teamWithStrikes: null, // Track which team accumulated strikes
    },
    reducers: {
        setFamily: (state, action) => {
            state.family = action.payload.map(family => ({
                ...family,
                points: 0,
                strike: 0
            }));
            state.teamWithStrikes = null; // Reset strikes tracking
        },
        setQuestion: (state, action) => {
            state.question = action.payload;
            // Reset current points and strikes, but keep total family points
            state.family = state.family.map(family => ({
                ...family,
                strike: 0  // Reset strikes
            }));
            state.teamWithStrikes = null; // Reset strikes tracking
        },
        setAnswer: (state, action) => {
            state.answers = action.payload;
        },
        setFamilyTurn: (state, action) => {
            state.familyTurn = action.payload;
        },
        setCurrentPoints: (state, action) => {
            state.point = action.payload;
        },
        addScore: (state, action) => {
            const currentFamilyIndex = state.family.findIndex(f => f._id === state.familyTurn);
            if (currentFamilyIndex !== -1) {
                // If Adnan (team 0) has strikes and Hamza (team 1) answers correctly
                if (state.teamWithStrikes === 0 && currentFamilyIndex === 1) {
                    state.family[1].points += state.family[0].points + action.payload;
                    state.family[0].points = 0;
                    state.teamWithStrikes = null;
                }
                // If Hamza (team 1) has strikes and Adnan (team 0) answers correctly
                else if (state.teamWithStrikes === 1 && currentFamilyIndex === 0) {
                    state.family[0].points += state.family[1].points + action.payload;
                    state.family[1].points = 0;
                    state.teamWithStrikes = null;
                }
                // Normal case (no strikes)
                else {
                    state.family[currentFamilyIndex].points += action.payload;
                }
            }
        },
        addStrike: (state, action) => {
            const familyIndex = state.family.findIndex(family => family._id === state.familyTurn);

            if (familyIndex !== -1) {
                state.family[familyIndex].strike = action.payload;

                // If Adnan (team 0) reaches 3 strikes
                if (familyIndex === 0 && action.payload === 3) {
                    // Track that Adnan has accumulated three strikes
                    state.teamWithStrikes = 0;
                    // Switch to Hamza (team 1)
                    state.familyTurn = state.family[1]._id;
                }
                // If Hamza (team 1) reaches 1 strike
                else if (familyIndex === 1 && action.payload === 1) {
                    // Track that Hamza has accumulated one strike
                    state.teamWithStrikes = 1;
                    // Switch back to Adnan (team 0)
                    state.familyTurn = state.family[0]._id;
                }
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
            state.family = [],
                state.answers = [],
                state.question = null,
                state.familyTurn = '',
                state.point = '',
                state.teamWithStrikes = null
        }
    }
});

export const { setFamily, setQuestion, setAnswer, setFamilyTurn, resetAnswer, addScore, addStrike, switchTeam, setCurrentPoints } = dashboardSlice.actions;
export default dashboardSlice.reducer;