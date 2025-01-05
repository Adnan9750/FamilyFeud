import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentQuestion: "Name a food that people often eat in their car",
    answers: [
        { id: 1, text: "Fast Food", points: 72, revealed: false },
        { id: 2, text: "Chips", points: 55, revealed: false },
        { id: 3, text: "Candy", points: 45, revealed: false },
        { id: 4, text: "Fries", points: 38, revealed: false },
        { id: 5, text: "Burger", points: 31, revealed: false },
        { id: 6, text: "Snacks", points: 24, revealed: false },
    ],
    currentTeam: 1,
    strikes: 0
};

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        revealAnswer: (state, action) => {
            const id = action.payload;
            state.answers = state.answers.map(answer =>
                answer.id === id ? { ...answer, revealed: true } : answer
            );
            state.strikes = 0;
        },
        addStrike: (state) => {
            state.strikes += 1;
            if (state.strikes >= 3) {
                state.currentTeam = state.currentTeam === 1 ? 2 : 1;
                state.strikes = 0;
            }
        },
        switchTeam: (state) => {
            state.currentTeam = state.currentTeam === 1 ? 2 : 1;
            state.strikes = 0;
        }
    }
});

export const { revealAnswer, addStrike, switchTeam } = gameSlice.actions;
export default gameSlice.reducer;