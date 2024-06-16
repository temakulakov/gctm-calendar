import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CounterSlice {
	value: 'day' | 'week' | 'month';
}

const initialState: CounterSlice = {
	value: 'month',
};

const counterSlice = createSlice({
	name: 'counter',
	initialState,
	reducers: {
		changeView: (state, action: PayloadAction<'day' | 'week' | 'month'>) => {
			state.value = action.payload;
		},
	},
});

export const { changeView } = counterSlice.actions;
export default counterSlice.reducer;
