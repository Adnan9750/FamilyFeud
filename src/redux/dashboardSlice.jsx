import { createSlice } from "@reduxjs/toolkit";


const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        family: [],
        question: null,
        answers: [],
        familyTurn: '',
        point: '',
    },
    reducers: {
        setFamily: (state, action) => {
            state.family = action.payload.map(family => ({
                ...family,
                points: 0,
                strike: 0
            }))
        },
        setQuestion: (state, action) => {
            state.question = action.payload;
            // Reset current points and strikes, but keep total family points
            state.family = state.family.map(family => ({
                ...family,
                strike: 0  // Reset strikes
            }));
        },
        setAnswer: (state, action) => {
            state.answers = action.payload
        },
        setFamilyTurn: (state, action) => {
            state.familyTurn = action.payload
        },
        setCurrentPoints: (state, action) => {
            state.point = action.payload
        },
        addScore: (state, action) => {
            const currentFamilyIndex = state.family.findIndex(f => f._id === state.familyTurn);
        
            if (currentFamilyIndex !== -1) {
                // If this is the second team's chance after first team's 3 strikes
                if (currentFamilyIndex === 1 && state.family[0].strike === 3) {
                    // Transfer first team's points plus new answer points to second team
                    state.family[1].points += state.family[0].points + action.payload;
                    state.family[0].points = 0;
                } else {
                    // Normal scoring
                    state.family[currentFamilyIndex].points += action.payload;
                }
            }
        },
        addStrike: (state, action) => {
            const familyIndex = state.family.findIndex(family => family._id === state.familyTurn);
        
            if (familyIndex !== -1) {
                state.family[familyIndex].strike = action.payload;
        
                // If first team reaches 3 strikes
                if (familyIndex === 0 && action.payload === 3) {
                    // Prepare for second team's chance
                    // Points will be transferred when second team gets a correct answer
                    state.familyTurn = state.family[1]._id;
                }
            }
        },
        // addScore: (state, action) => {
        //     console.log("option score:", action.payload);
        //     // Add points to current team's currentScore
        //     if (state.family[state.currentTeamIndex]) {
        //         state.family[state.currentTeamIndex].points += action.payload;
        //     }
        // },
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
                state.question = {}
        }
    }
})

export const { setFamily, setQuestion, setAnswer, setFamilyTurn, resetAnswer, addScore, addStrike, switchTeam, setCurrentPoints } = dashboardSlice.actions
export default dashboardSlice.reducer