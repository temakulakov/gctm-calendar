import { DownOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { AnimatePresence, motion } from 'framer-motion';
import React, {useEffect, useState} from 'react';
import { useAppSelector } from '../../../../../app/hook';
import { BXProcessedReportDay } from '../../../../../utils/bx.processed';
import { Build, Holiday, Room } from '../../../../../types/type';
import { LineLoad } from '../LineLoad/LineLoad';
import styles from './Menu.module.scss';
import {dayReport, getBuilds, getEvents, getRooms} from "../../../../../services/bx";
import {AppEvent} from "../../../../../types/event";
import {AppRoom, ReportRoom} from "../../../../../types/Room";

interface MenuProps {
	rooms: AppRoom[];
	builds: AppBuild[];
	events: AppEvent[];
	holidays?: Holiday[];
	active: number[];
	setActive: React.Dispatch<React.SetStateAction<number[]>>;
}

export const Menu = ({
	rooms,
	builds,
	holidays,
	events,
	active,
	setActive,
}: MenuProps) => {
	const currentDate = dayjs(useAppSelector(state => state.date.value));

	const { data: reports } = useQuery<ReportRoom[]>({
		queryKey: ['report', currentDate.date(), events.length],
		queryFn: () => dayReport(events, rooms),
		initialData: [],
	});




	return (
		<div className={styles.root} key={0}>
			{builds.map(build => (
				<div key={build.id} className={styles.buildLine}>
					<motion.div
						className={styles.header}
						whileHover={{
							backgroundColor: '#e8e8e8',
						}}
						animate={{
							height: active.includes(build.id)
								? '20px'
								: `${
										rooms.filter(room => room.section === build.id).length * 20
								  }px`,
						}}
						onClick={() =>
							setActive(prev =>
								prev.includes(build.id)
									? prev.filter(active => active !== build.id)
									: [...prev, build.id]
							)
						}
					>
						<h4>{build.title}</h4>
						<DownOutlined
							style={{
								transform: active.includes(build.id)
									? 'rotate(0deg)'
									: 'rotate(-90deg)',
								transition: 'all .2s ease',
							}}
						/>
					</motion.div>
					<AnimatePresence>
						{reports && (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: 'fit-content' }}
								exit={{ opacity: 0, height: 0 }}
								className={styles.body}
							>
								{rooms
									.filter(room => room.section === build.id)
									.map(room => (
										<div className={styles.roomLine} key={room.id}>
											{room.title}

											<LineLoad
												data={
													reports?.find(report => report.id === room.id) || null
												}
											/>
										</div>
									))}
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			))}
		</div>
	);
};

export default Menu;
