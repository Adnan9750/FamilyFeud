import { configureStore } from '@reduxjs/toolkit';
import gameSlice from './gameSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// import gameReducer from './gameSlice';

const persistConfig = {
    key: 'root',
    storage,
};

const persistedReducer = persistReducer(persistConfig, gameSlice);

export const store = configureStore({
    reducer: {
        game: gameSlice
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
});

export const persistor = persistStore(store);

// this is my whole code i want functionality like family feud show here
//  i got o problem that is when third strike come then in dashboard three
//   cross is not coming so tell me solution of this as check this properly is there
//    any change in data structure or other thing i want it however ui remain this 
//   same i only want three stikre come on third strike like in family feud show