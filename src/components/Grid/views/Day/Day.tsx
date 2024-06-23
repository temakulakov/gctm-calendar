import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../app/hook';
import {
	getBuilds,
	getEvents,
	getGoogleCalendar,
	getRooms,
} from '../../../../services/FastApi';
import { Build, IEvent, Room } from '../../../../types/type';
import styles from './Day.module.scss';

export const Day = () => {
	const currentDate = dayjs(useAppSelector(state => state.date.value));
	const [activeKeys, setActiveKeys] = useState<number[]>([]);
	const { data: rooms } = useQuery<Room[]>({
		queryKey: ['rooms'],
		queryFn: () => getRooms(),
		initialData: [],
	});

	const { data: builds } = useQuery<Build[]>({
		queryKey: ['build'],
		queryFn: () => getBuilds(),
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

	const dispatch = useAppDispatch();

	React.useEffect(() => {
		if (builds) {
			setActiveKeys(builds.map(build => build.id));
		}
	}, [builds]);

	const { data: events } = useQuery<IEvent[]>({
		queryKey: ['events', currentDate],
		queryFn: () =>
			getEvents({
				dateFrom: currentDate.startOf('month'),
				dateTo: currentDate.endOf('month'),
			}),
		initialData: [],
	});

	return (
		<div className={styles.root}>
			<div className={styles.content}></div>
		</div>
	);
};
