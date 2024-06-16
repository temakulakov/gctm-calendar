import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import dateSlice from '../features/date/dateSlice';
import viewSlice from '../features/view/viewSlice';

export const store = configureStore({
	reducer: {
		counter: counterReducer,
		date: dateSlice,
		view: viewSlice,
	},
});

// Типизация корневого состояния и dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
