import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import setupAPI from "../services/Api";

const API = setupAPI()

export const fetchQuestionAnswer = createAsyncThunk(
    'questions/fetchQuestions',
    async () => {
        try {
            const response = await API.get('/survey/get-surveys')
            // return response?.data?.data[0]
            if (response?.data?.success) {
                // Transform all surveys to include revealed property
                const transformedSurveys = response?.data?.data

                // Prepare first question's answers in the required format
                const firstSurvey = transformedSurveys[0];
                // const firstQuestionAnswers = firstSurvey.answers.map((answer, index) => ({
                //     id: index + 1,
                //     text: answer.text,
                //     points: answer.points,
                //     revealed: answer.revealed
                // }));

                return {
                    allSurveys: transformedSurveys,
                    currentQuestion: firstSurvey,
                    // currentAnswers: firstQuestionAnswers
                };
            }

            return rejectWithValue('No data received');
        } catch (error) {
            console.log();
        }
    }
)

const answerSlice = createSlice({
    name: 'answers',
    initialState: {
        currentQuestion: '',
        answers: [],
        currentTeam: 1,
        strikes: 0,
        isAutoSwitchingTeam: false,
        allSurveys: [],
        data:[],
        currentQuestionIndex: 0,
        // status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        loading: false,
        error: null
    },
    reducers: {
        revealAnswer: (state, action) => {
            const answer = state.answers.find(a => a.id === action.payload);
            if (answer) {
                answer.revealed = true;
            }
        },
        addStrike: (state) => {
            if (state.strikes < 3) {
                state.strikes += 1;
            }
        },
        switchTeam: (state) => {
            state.currentTeam = state.currentTeam === 1 ? 2 : 1;
            state.strikes = 0;
        },
        setNextQuestion: (state) => {
            const nextIndex = state.currentQuestionIndex + 1;
            if (nextIndex < state.allSurveys.length) {
                state.currentQuestionIndex = nextIndex;
                const nextSurvey = state.allSurveys[nextIndex];
                state.currentQuestion = nextSurvey.question;
                state.answers = nextSurvey.answers.map((answer, index) => ({
                    id: index + 1,
                    text: answer.text,
                    points: answer.points,
                    revealed: false
                }));
                state.strikes = 0;
            }
        }
    },
    extraReducers: (builder) => {
        builder

            .addCase(fetchQuestionAnswer.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(fetchQuestionAnswer.fulfilled, (state, action) => {
                state.loading = true,
                    state.data = action.payload.allSurveys;
                state.currentQuestion = action.payload.currentQuestion;
                // state.answers = action.payload;
            })
            .addCase(fetchQuestionAnswer.rejected, (state) => {
                state.loading = false,
                    state.error = action.payload
            })

    }
})

export const { revealAnswer, addStrike, switchTeam, setNextQuestion } = answerSlice.actions;
export default answerSlice.reducer