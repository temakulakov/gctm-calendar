import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FiltersState {
	selectedRooms: number[];
}

const initialState: FiltersState = {
	selectedRooms: [],
};

const filtersSlice = createSlice({
	name: 'filters',
	initialState,
	reducers: {
		toggleRoom: (state, action: PayloadAction<number>) => {
			if (state.selectedRooms.includes(action.payload)) {
				state.selectedRooms = state.selectedRooms.filter(
					id => id !== action.payload
				);
			} else {
				state.selectedRooms.push(action.payload);
			}
		},
		setAllRooms: (state, action: PayloadAction<number[]>) => {
			state.selectedRooms = action.payload;
		},
	},
});

export const { toggleRoom, setAllRooms } = filtersSlice.actions;
export default filtersSlice.reducer;
