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

	const [ typeEvent, setTypeEvent] = useState<EventType[]>();
	const [ departments, setDepartments] = useState<EventType[]>();
	const [ rooms_, setRooms] = useState<EventType[]>();
	const [ contract, setContract] = useState<EventType[]>();
	const [ publish, setPublish] = useState<EventType[]>();
	const [ age, setAge ] = useState<EventType[]>();

	const {data: userFields, error} = useQuery({queryKey: ['userFields'], queryFn: getFields});

	useEffect(() => {
		if (!error && userFields) {
			userFields.forEach((element, index) => {
				if (element.id === 129 && element.list) setTypeEvent(element.list);
				if (element.id === 131 && element.list) setDepartments(element.list);
				if (element.id === 132 && element.list) setRooms(element.list);
				if (element.id === 133 && element.list) setContract(element.list);
				if (element.id === 134 && element.list) setPublish(element.list);
				if (element.id === 144 && element.list) setAge(element.list);
			});

		}


	}, [userFields]);

	useEffect(() => {
		console.log(rooms_);
		console.log(contract);
		console.log(typeEvent);
		console.log(departments);
		console.log(publish);
		console.log(age);
	}, [rooms_, contract, typeEvent, departments, publish, age]);

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
				title={
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<div
							style={{
								height: '20px',
								minWidth: '20px',
								borderRadius: '50%',
								backgroundColor: rooms.find(
									room => room.id === selectedEvent?.rooms
								)?.color,
								marginRight: '10px',
							}}
						/>
						{selectedEvent?.title}
					</div>
				}
				open={!!selectedEvent}
				onCancel={() => setSelectedEvent(null)}
				footer={null}
			>
				{selectedEvent && (
					<div>
						<p>
							<strong>Стадия:</strong> {selectedEvent.stageId}
						</p>
						<p>
							<strong>Цена билета:</strong> {selectedEvent.opportunity}
						</p>
						<p>
							<strong>Ответственные сотрудники:</strong>{' '}
							 {/*{*/}
								{/* selectedEvent.responsibleStaffList.map((el) => <div className={styles.userWrapper}>*/}
								{/*	 <img src={users}/>*/}
								{/* </div>)*/}
							 {/*}*/}
						</p>
						<p>
							<strong>Начало события:</strong>{' '}
							{selectedEvent.dateFrom.format('DD/MM/YYYY HH:mm')}
						</p>
						<p>
							<strong>Окончание события:</strong>{' '}
							{selectedEvent.dateTo.format('DD/MM/YYYY HH:mm')}
						</p>
						<p>
							<strong>Вид мероприятия:</strong> {selectedEvent.type}
						</p>
						<p>
							<strong>Продолжительность:</strong> {selectedEvent.duration}
						</p>
						<p>
							{/*<strong>Department:</strong> {selectedEvent.department}*/}
						</p>
						<p>
							<strong>Зал:</strong> {selectedEvent.rooms}
						</p>
						{
							rooms_ && <p>
								<><strong>Зал:</strong> {rooms_.find(item => item.id === Number(selectedEvent.rooms)) ? rooms_.find(item => item.id === Number(selectedEvent.rooms))?.title : 'null'}</>
							</p>
						}
						<p>
							<strong>Количество мест:</strong> {selectedEvent.seatsCount}
						</p>
						{
							contract && <p>
								<><strong>Вид
									договора:</strong> {contract.find(item => item.id === Number(selectedEvent.contractType)) ? contract.find(item => item.id === Number(selectedEvent.contractType))?.title : 'null'}</>
							</p>
						}
						<p>
							<strong>Цена билета:</strong> {selectedEvent.price}
						</p>
						<p>
							<strong>Реквизиты:</strong> {selectedEvent.requisites}
						</p>
						<p>
							<strong>Action Places:</strong>{' '}
							{/*{selectedEvent.actionPlaces.join(', ')}*/}
						</p>
						<p>
							<strong>Требуется ли техническая поддержка:</strong>{' '}
							{selectedEvent.technicalSupportRequired}
						</p>
						<p>
							<strong>Комментарии:</strong> {selectedEvent.comments}
						</p>
						<p>
							<strong>Информация о событии:</strong> {selectedEvent.eventDetails}
						</p>
						{
							selectedEvent.contactFullName !== '' && <p>
								<strong>ФИО ответственного:</strong>{' '}
								{selectedEvent.contactFullName}
							</p>
						}
						<p>
							<strong>Assigned By ID:</strong> {selectedEvent.assignedById}
						</p>
						<p>
						{/*<strong>Создал:</strong> {selectedEvent.createdBy}*/}
						</p>
						<p>
							<strong>Описание:</strong> {selectedEvent.description}
						</p>
						{/*<p>*/}
						{/*	<strong>Tech Support Needs:</strong>{' '}*/}
						{/*	{selectedEvent.techSupportNeeds}*/}
						{/*</p>*/}
					</div>
				)}
			</Modal>
		</div>
	);
};
