import { useQuery } from '@tanstack/react-query';
import { Modal } from 'antd';
import dayjs from 'dayjs';
import {useEffect, useState} from 'react';
import { useAppDispatch, useAppSelector } from '../../../../app/hook';
import {
	decrementMonth,
	incrementMonth,
	selectDate,
} from '../../../../features/date/dateSlice';
import { changeView } from '../../../../features/view/viewSlice';
import {
	getEvents, getFields,
	// getGoogleCalendar,
	getRooms,
} from '../../../../services/bx';
import {EventType, Holiday, IEvent, Room} from '../../../../types/type';
import styles from './Month.module.scss';
import useArrowKeys from './hooks/useArrowKeys';
import { generateCalendarDates } from './utils';
import {AppEvent} from "../../../../types/event";
import {holidays} from "../../../../consts";
import {useModalContext} from "../../../../contexts/ModalContext";
import EventModal from "../../../Modal/Event/EventModal";


const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export const Month = () => {
	const dispatch = useAppDispatch();
	const currentDate = useAppSelector(store => dayjs(store.date.value));
	const { selectedRooms } = useAppSelector(store => store.filters);

	const { data: events } = useQuery<AppEvent[]>({
		queryKey: ['events', currentDate],
		queryFn: () =>
			getEvents(
				currentDate.startOf('month'),
				currentDate.endOf('month')),
		initialData: [],
	});






	const { openModal } = useModalContext();




	const { data: rooms, isLoading } = useQuery<Room[]>({
		queryKey: ['rooms'],
		queryFn: () => getRooms(),
		initialData: [],
	});

	const dates = generateCalendarDates(currentDate);

	const handleArrowPress = (direction: 'left' | 'right' | 'up' | 'down') => {
		switch (direction) {
			case 'left':
				dispatch(decrementMonth());
				break;
			case 'right':
				dispatch(incrementMonth());
				break;
			case 'up':
				dispatch(incrementMonth());
				break;
			case 'down':
				dispatch(decrementMonth());
				break;
			default:
				break;
		}
	};

	useArrowKeys(handleArrowPress);

	const viewMode = useAppSelector(state => state.view.value);

	const [selectedEvent, setSelectedEvent] = useState<AppEvent | null>(null);
	return (
		<div className={styles.root}>
			<div className={styles.weekLine}>
				{weekDays.map((day, index) => (
					<span key={index} className={styles.weekday}>
						{day}
					</span>
				))}
			</div>

			<div className={styles.calendarGrid}>
				{dates.map((date, index) => {
					const dayEvents =
						events
							?.filter((event: AppEvent) => selectedRooms.includes(event.rooms))
							?.filter((event: AppEvent) =>
								dayjs(event.dateFrom).isSame(date, 'day')
							) || [];

					const dayHolidays =
						holidays?.filter((holiday: Holiday) =>
							dayjs(holiday.dateFrom).isSame(date, 'day')
						) || [];

					return (
						<div
							key={index}
							className={`${styles.calendarCell} ${
								date.month() !== currentDate.month() ? styles.otherMonth : ''
							}`}
							onClick={() => {
								openModal(date, true)
							}}
						>
							<div
								onClick={() => {
									dispatch(changeView('day'));
									dispatch(selectDate(date.toISOString()));
								}}
								className={`${styles.dateNumber} ${
									index < 7 ? styles.firstRow : ''
								}`}
							>
								{date.date()}
							</div>

							{selectedRooms.includes(0) &&
								dayHolidays.map((holiday, holidayIndex) => (
									<div
										key={`holiday-${holidayIndex}`}
										className={styles.eventTitle}
										style={{
											top: `${35 + holidayIndex * 20}px`,
											backgroundColor: '#FFD700',
										}}
									>
										{holiday.title}
									</div>
								))}

							{dayEvents.map((event, eventIndex) => {
								const room = rooms.find(
									room => Number(room.id) === Number(event.rooms)
								);

								return (
									<div
										key={eventIndex}
										className={styles.eventTitle}
										style={{
											top: `${
												35 +
												((selectedRooms.includes(0) ? dayHolidays.length : 0) +
													eventIndex) *
													20
											}px`,
											backgroundColor: room ? room.color : 'transparent',
										}}
										onClick={(e) => {
											e.stopPropagation()
											openModal(event, true)
										}}
									>
										{event.title}
									</div>
								);
							})}
						</div>
					);
				})}
			</div>
			<EventModal />
		</div>
	);
};
