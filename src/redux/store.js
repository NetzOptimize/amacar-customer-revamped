import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import carDetailsAndQuestionsReducer from './slices/carDetailsAndQuestionsSlice';
import offersReducer from './slices/offersSlice';
import reverseBidReducer from '@/features/reverseBidding/redux/reverseBidSlice';
import persistReducer from 'redux-persist/es/persistReducer';
import { carPersistConfig, userPersistConfig } from './persistConfig';
import persistStore from 'redux-persist/es/persistStore';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from 'redux-persist';

export const store = configureStore({
  reducer: {
    user: persistReducer(userPersistConfig, userReducer),
    carDetailsAndQuestions: persistReducer(carPersistConfig, carDetailsAndQuestionsReducer),
    offers: offersReducer,
    reverseBid: reverseBidReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist action types (they use non-serializable payloads)
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: true,
});

export const persistor = persistStore(store);
export default store;