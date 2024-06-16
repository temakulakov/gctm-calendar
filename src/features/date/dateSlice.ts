import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

interface DateSlice {
	value: string;
}

const initialState: DateSlice = {
	value: dayjs().toISOString(),
};

const dateSlice = createSlice({
	name: 'date',
	initialState,
	reducers: {
		incrementDay: state => {
			dayjs(state.value).add(1, 'day').toISOString();
		},
		incrementWeek: state => {
			dayjs(state.value).add(1, 'week').toISOString();
		},
		incrementMonth: state => {
			dayjs(state.value).add(1, 'month').toISOString();
		},
		decrementDay: state => {
			dayjs(state.value).subtract(1, 'day').toISOString();
		},
		decrementWeek: state => {
			dayjs(state.value).subtract(1, 'week').toISOString();
		},
		decrementMonth: state => {
			dayjs(state.value).subtract(1, 'month').toISOString();
		},
		selectDate: (state, action: PayloadAction<string>) => {
			state.value = action.payload;
		},
	},
});

export const {
	incrementDay,
	incrementWeek,
	incrementMonth,
	decrementDay,
	decrementWeek,
	decrementMonth,
	selectDate,
} = dateSlice.actions;
export default dateSlice.reducer;
