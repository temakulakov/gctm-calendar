// src/features/date/selectors.ts
import { createSelector } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import { RootState } from '../../app/store';

const selectDateValue = (state: RootState) => state.date.value;

export const selectCurrentDate = createSelector(
	[selectDateValue],
	value => dayjs(value) // Преобразуем строку в объект dayjs
);

const selectViewValue = (state: RootState) => state.view.value;

export const selectCurrentView = createSelector(
	[selectViewValue],
	value => value
);
