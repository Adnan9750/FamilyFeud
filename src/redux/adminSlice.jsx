import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        family: [],
        question: {},
        answer: [],
        currentTeamIndex: 1, // Default to Hamza (second team) as the first turn
        currentFamilyId: null,
        strikeCount: 0,
        gameStage: 'first_team', // 'first_team' (3 strikes), 'second_team_chance' (1 strike)
        firstTeamStrikes: 0,
        secondTeamStrikes: 0,
        teamWithStrikes: null,
    },
    reducers: {
        setFamily: (state, action) => {
            state.family = action.payload.map((family, index) => ({
                ...family,
                points: 0,
                currentPoints: 0,
                strikes: 0,
                teamOrder: index === 1 ? 'first' : 'second' // Hamza (index 1) starts as 'first'
            }));
            state.currentTeamIndex = 1; // Hamza starts
            state.currentFamilyId = state.family[1]._id;
            state.gameStage = 'first_team';
            state.firstTeamStrikes = 0;
            state.secondTeamStrikes = 0;
            state.strikeCount = 0;
            state.teamWithStrikes = null;
            console.log("setFamily: Hamza starts as first team");
        },
        setCurrentFamilyId: (state, action) => {
            state.currentFamilyId = action.payload;
        },
        setQuestion: (state, action) => {
            state.question = action.payload;
            state.answer = action.payload.answers.map(ans => ({
                ...ans,
                revealed: false
            }));
            state.gameStage = 'first_team';
            state.currentTeamIndex = 1; // Hamza starts by default
            state.currentFamilyId = state.family[1]._id;
            state.firstTeamStrikes = 0;
            state.secondTeamStrikes = 0;
            state.strikeCount = 0;
            state.teamWithStrikes = null;
            // Reset teamOrder to ensure Hamza is 'first' again
            state.family = state.family.map((family, index) => ({
                ...family,
                currentPoints: 0,
                strikes: 0,
                teamOrder: index === 1 ? 'first' : 'second' // Reset Hamza as 'first'
            }));
            console.log("setQuestion: Reset to Hamza as first team, strikeCount:", state.strikeCount);
        },
        setAnswer: (state, action) => {
            state.answer = action.payload;
        },
        addScore: (state, action) => {
            const { points } = action.payload;
            if (state.gameStage === 'second_team_chance' && state.teamWithStrikes !== null) {
                const firstTeamIndex = state.teamWithStrikes;
                const secondTeamIndex = state.currentTeamIndex;
                const firstTeamCurrentPoints = state.family[firstTeamIndex].currentPoints;
                state.family[secondTeamIndex].points += firstTeamCurrentPoints + points;
                state.family[secondTeamIndex].currentPoints += points;
                state.family[firstTeamIndex].points -= firstTeamCurrentPoints;
                state.family[firstTeamIndex].currentPoints = 0;
            } else {
                state.family[state.currentTeamIndex].points += points;
                state.family[state.currentTeamIndex].currentPoints += points;
            }
        },
        addStrike: (state) => {
            const currentFamily = state.family[state.currentTeamIndex];
            const isFirstTeam = currentFamily.teamOrder === 'first';

            console.log("addStrike: Current Team:", currentFamily.name, "isFirstTeam:", isFirstTeam, "gameStage:", state.gameStage);

            if (isFirstTeam && state.gameStage === 'first_team') {
                state.firstTeamStrikes += 1;
                state.strikeCount += 1;
                console.log("First Team Strike Added - firstTeamStrikes:", state.firstTeamStrikes, "strikeCount:", state.strikeCount);

                if (state.firstTeamStrikes >= 3) {
                    state.teamWithStrikes = state.currentTeamIndex;
                    state.gameStage = 'second_team_chance';
                    const secondTeamIndex = state.family.findIndex(fam => fam.teamOrder === 'second');
                    state.currentTeamIndex = secondTeamIndex;
                    state.currentFamilyId = state.family[secondTeamIndex]._id;
                    state.strikeCount = 0;
                    console.log("Switched to second team after 3 strikes - secondTeamIndex:", secondTeamIndex);
                }
            } else if (!isFirstTeam && state.gameStage === 'second_team_chance') {
                state.secondTeamStrikes += 1;
                state.strikeCount += 1;
                console.log("Second Team Strike Added - secondTeamStrikes:", state.secondTeamStrikes, "strikeCount:", state.strikeCount);

                if (state.secondTeamStrikes >= 1) {
                    state.teamWithStrikes = state.currentTeamIndex;
                    // state.answer = state.answer.map(ans => ({ ...ans, revealed: true }));
                    // state.gameStage = 'first_team';
                    // state.currentTeamIndex = state.family.findIndex(fam => fam.teamOrder === 'first');
                    // state.currentFamilyId = state.family[state.currentTeamIndex]._id;
                    state.strikeCount = 0;
                    console.log("Switched back to first team after second team's strike");
                }
            }
        },
        switchTeam: (state) => {
            const hasRevealedAnswers = state.answer.some(ans => ans.revealed);
            const hasStrikes = state.gameStage === 'first_team' ? state.firstTeamStrikes > 0 : state.secondTeamStrikes > 0;

            if (!hasRevealedAnswers && !hasStrikes) {
                state.currentTeamIndex = state.currentTeamIndex === 0 ? 1 : 0;
                state.currentFamilyId = state.family[state.currentTeamIndex]._id;
                state.gameStage = 'first_team';
                state.firstTeamStrikes = 0;
                state.secondTeamStrikes = 0;
                state.strikeCount = 0;
                state.family = state.family.map((fam, index) => ({
                    ...fam,
                    teamOrder: index === state.currentTeamIndex ? 'first' : 'second'
                }));
                state.teamWithStrikes = null;
                console.log("switchTeam: Switched to team index:", state.currentTeamIndex);
            }
        },
        resetAll: (state) => {
            state.family = [];
            state.question = {};
            state.answer = [];
            state.currentTeamIndex = 1; // Reset to Hamza
            state.currentFamilyId = null;
            state.strikeCount = 0;
            state.firstTeamStrikes = 0;
            state.secondTeamStrikes = 0;
            state.gameStage = 'first_team';
            state.teamWithStrikes = null;
            console.log("resetAll: Reset to initial state with Hamza as first team");
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