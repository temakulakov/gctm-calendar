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
			state.value = dayjs(state.value).add(1, 'day').toISOString();
		},
		incrementWeek: state => {
			state.value = dayjs(state.value).add(1, 'week').toISOString();
		},
		incrementMonth: state => {
			state.value = dayjs(state.value).add(1, 'month').toISOString();
		},
		decrementDay: state => {
			state.value = dayjs(state.value).subtract(1, 'day').toISOString();
		},
		decrementWeek: state => {
			state.value = dayjs(state.value).subtract(1, 'week').toISOString();
		},
		decrementMonth: state => {
			state.value = dayjs(state.value).subtract(1, 'month').toISOString();
		},
		selectDate: (state, action: PayloadAction<string>) => {
			state.value = action.payload;
		},
		selectToday: state => {
			state.value = dayjs().toISOString();
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
	selectToday,
} = dateSlice.actions;

export default dateSlice.reducer;
