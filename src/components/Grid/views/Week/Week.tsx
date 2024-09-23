import { useQuery } from '@tanstack/react-query';
import dayjs, { Dayjs } from 'dayjs';
import React, { useRef, useState } from 'react';
import {
	useAppDispatch,
	useAppSelector,
	useScroll,
} from '../../../../app/hook';
import { selectDate } from '../../../../features/date/dateSlice';
import { changeView } from '../../../../features/view/viewSlice';
import {holidays} from "../../../../consts";
import {
	getEvents,
	getRooms,
} from '../../../../services/bx';
import { IEvent, Room } from '../../../../types/type';
import styles from './Week.module.scss';
import {AppEvent} from "../../../../types/event";
import {useModalContext} from "../../../../contexts/ModalContext";
import EventModal from "../../../Modal/Event/EventModal";

const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const $weekHeight = 960;

export const Week: React.FC = () => {
	const currentDate = dayjs(useAppSelector(state => state.date.value));
	const { selectedRooms } = useAppSelector(state => state.filters);
	const dispatch = useAppDispatch();
	const [selectedEvent, setSelectedEvent] = useState<AppEvent | null>(null);
	const gridRef = useRef<HTMLDivElement>(null);
	const [scrollPixels, setScrollPixels] = useState(0);

	const { openModal } = useModalContext();

	// Вызов useScroll с обновленным значением scrollPixels
	useScroll(gridRef, scrollPixels);

	const handleScroll = () => {
		setScrollPixels(100); // Устанавливаем количество пикселей для скроллинга
	};

	const selectDay = (day: Dayjs) => {
		dispatch(changeView('day'));
		dispatch(selectDate(day.toISOString()));
	};

	const { data: events } = useQuery<AppEvent[]>({
		queryKey: ['events', currentDate],
		queryFn: () =>
			getEvents(
				currentDate.startOf('month'),
				currentDate.endOf('month'),
			),
		initialData: [],
	});

	const { data: rooms } = useQuery<Room[]>({
		queryKey: ['rooms'],
		queryFn: () => getRooms(),
		initialData: [],
	});

	return (
		<div className={styles.root}>
			<button onClick={handleScroll}>Scroll</button>
			<div className={styles.weekDays}>
				<div className={styles.line}>
					{weekDays.map((el, index) => {
						const day = dayjs(currentDate).startOf('week').add(index, 'day');
						const isActive = day.isSame(dayjs(), 'day');
						return (
							<div key={index} className={styles.weekDayContainer}>
								<div className={styles.weekDay}>{el}</div>
								<div
									className={`${styles.weekDayNumber} ${
										isActive ? styles.active : ''
									}`}


									onClick={() => selectDay(day)}
								>
									{day.format('D')}
								</div>
							</div>
						);
					})}
				</div>
				<div className={styles.holidaysLine}>
					{weekDays.map((item, index) => {
						return (
							<div className={styles.holContainer} key={index}>
								{holidays &&
									holidays
										.filter(holiday => selectedRooms.includes(0))
										.filter(holiday =>
											dayjs(holiday.dateFrom).isSame(
												dayjs(currentDate).startOf('week').add(index, 'day'),
												'day'
											)
										)
										.map((item, index) => {
											return (
												<div key={index} className={styles.holiday}>
													{item.title}
												</div>
											);
										})}
							</div>
						);
					})}
				</div>
			</div>
			<div className={styles.grid} ref={gridRef}>
				<div className={styles.timeLine}>
					<div />
					{Array.from({ length: 24 }).map((_, index) => {
						return (
							<span key={index} className={styles.element}>
								{index + 1}
							</span>
						);
					})}
					<div />
				</div>
				{weekDays.map((el, index) => {
					const day = dayjs(currentDate).startOf('week').add(index, 'day');
					const dayEvents = events
						?.filter((event: AppEvent) => selectedRooms.includes(event.rooms))
						.filter((event: AppEvent) =>
							dayjs(event.dateFrom).isSame(day, 'day')
						);
					const current = dayjs().isSame(
						dayjs(currentDate).startOf('week').add(index, 'day'),
						'day'
					);
					return (
						<div className={styles.cell} key={index} onClick={() => {
							openModal(dayjs(currentDate), true)
						}}>
							{current && (
								<div
									className={styles.redLine}
									style={{
										top:
											dayjs().diff(dayjs().startOf('day'), 'minute') *
												($weekHeight / 24 / 60) -
											18,
									}}
								/>
							)}
							{dayEvents?.map((event, idx) => {
								const room = rooms.find(
									room => Number(room.id) === Number(event.rooms)
								);
								return (
									<div
										key={idx}
										className={styles.event}
										style={{
											backgroundColor: room ? room.color : 'transparent',
											minHeight: 'fit-content',
											height:
												event.dateTo
													.date(1)
													.diff(event.dateFrom.date(1), 'minute') *
												($weekHeight / 24 / 60),
											top: `${
												event.dateFrom.diff(
													event.dateFrom.startOf('day'),
													'minute'
												) *
													($weekHeight / 24 / 60) -
												18
											}px`,
										}}
										onClick={(e) => {
											e.stopPropagation()
											openModal(event, true)
										}}
									>
										<b>{event.title}</b>
										<br />
										{event.dateFrom.format('HH:mm')}-
										{event.dateTo.format('HH:mm')}
									</div>
								);
							})}
						</div>
					);
				})}
				<div>
					{Array.from({ length: 24 }).map((_, index) => (
						<div key={index} className={styles.line}></div>
					))}
				</div>
			</div>
			<EventModal />
		</div>
	);
};
