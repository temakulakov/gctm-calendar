import { useQuery } from '@tanstack/react-query';
import { Modal } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../app/hook';
import {
	decrementMonth,
	incrementMonth,
} from '../../../../features/date/dateSlice';
import {
	getEvents,
	getGoogleCalendar,
	getRooms,
} from '../../../../services/FastApi';
import { Holiday, IEvent, Room } from '../../../../types/type';
import styles from './Month.module.scss';
import useArrowKeys from './hooks/useArrowKeys';
import { generateCalendarDates } from './utils';

const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export const Month = () => {
	const dispatch = useAppDispatch();
	const currentDate = useAppSelector(store => dayjs(store.date.value));

	const { data: events } = useQuery<IEvent[]>({
		queryKey: ['events', currentDate],
		queryFn: () =>
			getEvents({
				dateFrom: currentDate.startOf('month'),
				dateTo: currentDate.endOf('month'),
			}),
		initialData: [],
	});

	const {
		data: holidays,
		isLoading: isLoadingHolidays,
		error: errorHolidays,
	} = useQuery({
		queryKey: ['google'],
		queryFn: () =>
			getGoogleCalendar({
				googleUrl:
					'https://calendar.google.com/calendar/ical/ru.russian%23holiday%40group.v.calendar.google.com/public/basic.ics',
			}),
	});

	const { data: rooms } = useQuery<Room[]>({
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

	const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);

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
						events?.filter((event: IEvent) =>
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
						>
							<div
								className={`${styles.dateNumber} ${
									index < 7 ? styles.firstRow : ''
								}`}
							>
								{date.date()}
							</div>

							{dayHolidays.map((holiday, holidayIndex) => (
								<div
									key={`holiday-${holidayIndex}`}
									className={styles.eventTitle}
									style={{
										top: `${20 + holidayIndex * 20}px`,
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
											top: `${20 + (dayHolidays.length + eventIndex) * 20}px`,
											backgroundColor: room ? room.color : 'transparent',
										}}
										onClick={() => setSelectedEvent(event)}
									>
										{event.title}
									</div>
								);
							})}
						</div>
					);
				})}
			</div>

			<Modal
				title={selectedEvent?.title}
				open={!!selectedEvent}
				onCancel={() => setSelectedEvent(null)}
				footer={null}
			>
				{selectedEvent && (
					<div>
						<p>
							<strong>Stage ID:</strong> {selectedEvent.stageId}
						</p>
						<p>
							<strong>Opportunity:</strong> {selectedEvent.opportunity}
						</p>
						<p>
							<strong>Responsible Staff:</strong>{' '}
							{selectedEvent.responsibleStaffList.join(', ')}
						</p>
						<p>
							<strong>From:</strong>{' '}
							{selectedEvent.dateFrom.format('DD/MM/YYYY HH:mm')}
						</p>
						<p>
							<strong>To:</strong>{' '}
							{selectedEvent.dateTo.format('DD/MM/YYYY HH:mm')}
						</p>
						<p>
							<strong>Type:</strong> {selectedEvent.type}
						</p>
						<p>
							<strong>Duration:</strong> {selectedEvent.duration}
						</p>
						<p>
							<strong>Department:</strong> {selectedEvent.department}
						</p>
						<p>
							<strong>Rooms:</strong> {selectedEvent.rooms}
						</p>
						<p>
							<strong>Seats Count:</strong> {selectedEvent.seatsCount}
						</p>
						<p>
							<strong>Contract Type:</strong> {selectedEvent.contractType}
						</p>
						<p>
							<strong>Price:</strong> {selectedEvent.price}
						</p>
						<p>
							<strong>Requisites:</strong> {selectedEvent.requisites}
						</p>
						<p>
							<strong>Action Places:</strong>{' '}
							{selectedEvent.actionPlaces.join(', ')}
						</p>
						<p>
							<strong>Technical Support Required:</strong>{' '}
							{selectedEvent.technicalSupportRequired}
						</p>
						<p>
							<strong>Comments:</strong> {selectedEvent.comments}
						</p>
						<p>
							<strong>Event Details:</strong> {selectedEvent.eventDetails}
						</p>
						<p>
							<strong>Contact Full Name:</strong>{' '}
							{selectedEvent.contactFullName}
						</p>
						<p>
							<strong>Assigned By ID:</strong> {selectedEvent.assignedById}
						</p>
						<p>
							<strong>Created By:</strong> {selectedEvent.createdBy}
						</p>
						<p>
							<strong>Description:</strong> {selectedEvent.description}
						</p>
						<p>
							<strong>Tech Support Needs:</strong>{' '}
							{selectedEvent.techSupportNeeds}
						</p>
					</div>
				)}
			</Modal>
		</div>
	);
};
