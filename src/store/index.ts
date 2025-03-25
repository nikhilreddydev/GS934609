import { configureStore } from '@reduxjs/toolkit';
import planningReducer from './planningSlice';

const store = configureStore({
  reducer: {
    planning: planningReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
