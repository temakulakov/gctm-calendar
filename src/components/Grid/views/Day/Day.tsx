import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../app/hook';

import {
	decrementDay,
	incrementDay,
} from '../../../../features/date/dateSlice';
import {
	getBuilds,
	getEvents,
	getRooms,
} from '../../../../services/bx';
import { Build, IEvent, Room } from '../../../../types/type';
import useArrowKeys from '../Month/hooks/useArrowKeys';
import styles from './Day.module.scss';
import { Grid } from './Grid/Grid';
import { Menu } from './Menu/Menu';
import {holidays} from "../../../../consts";
import {AppEvent} from "../../../../types/event";

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


	const dispatch = useAppDispatch();

	React.useEffect(() => {
		if (builds) {
			setActiveKeys(builds.map(build => build.id));
		}
	}, [builds]);

	const handleArrowPress = (direction: 'left' | 'right' | 'up' | 'down') => {
		switch (direction) {
			case 'left':
				dispatch(decrementDay());
				break;
			case 'right':
				dispatch(incrementDay());
				break;
			case 'up':
				dispatch(incrementDay());
				break;
			case 'down':
				dispatch(decrementDay());
				break;
			default:
				break;
		}
	};

	useArrowKeys(handleArrowPress);

	const { data: events } = useQuery<AppEvent[]>({
		queryKey: ['events', currentDate],
		queryFn: () =>
			getEvents(
				currentDate.startOf('month'),
				currentDate.endOf('month'),
			),
		initialData: [],
	});

	return (
		<div className={styles.root}>
			<AnimatePresence>
				{!holidays && (
					<motion.div animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
						<Menu
							builds={builds}
							rooms={rooms}
							// holidays={holidays}
							active={activeKeys}
							setActive={setActiveKeys}
						/>
					</motion.div>
				)}

				{!holidays && (
					<motion.div
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className={styles.content}
					>
						<Grid
							events={events.filter(
								(event: AppEvent) =>
									event.dateFrom.isSame(currentDate, 'day') ||
									event.dateTo.isSame(currentDate, 'day')
							)}
							builds={builds}
							rooms={rooms}
							holidays={holidays}
							active={activeKeys}
						/>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};
