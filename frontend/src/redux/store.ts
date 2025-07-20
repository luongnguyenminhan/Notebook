import { configureStore } from '@reduxjs/toolkit';
// Import slices here when created
import authReducer from './authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    // Add reducers here
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store; 