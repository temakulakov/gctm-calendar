import { Dayjs } from 'dayjs';

export const generateCalendarDates = (currentDate: Dayjs): Dayjs[] => {
	const startOfMonth = currentDate.startOf('month');
	const endOfMonth = currentDate.endOf('month');
	const startDate = startOfMonth.startOf('week');
	const endDate = endOfMonth.endOf('week');

	const dates: Dayjs[] = [];
	let current = startDate;

	while (current.isBefore(endDate) || current.isSame(endDate, 'day')) {
		dates.push(current);
		current = current.add(1, 'day');
	}

	return dates;
};
