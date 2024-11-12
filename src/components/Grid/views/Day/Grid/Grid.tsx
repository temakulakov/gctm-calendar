import { motion } from 'framer-motion';
import { Build, Holiday, IEvent, Room } from '../../../../../types/type';
import styles from './Grid.module.scss';
import { TimeLine } from './TimeLine/TimeLine';
import { useHorizontalScroll } from './utils';
import React, {useEffect, useRef} from "react";
import {AppEvent} from "../../../../../types/event";
import {AppRoom} from "../../../../../types/Room";
import EventModal from "../../../../Modal/Event/EventModal";
import {useModalContext} from "../../../../../contexts/ModalContext";

interface GridProps {
	rooms: AppRoom[];
	builds: AppBuild[];
	holidays?: Holiday[];
	active: number[];
	events: AppEvent[];
}

const $dayWidth = 1900;

export const Grid = ({
	events,
	rooms,
	builds,
	holidays,
	active,
}: GridProps) => {
	const { openModal } = useModalContext();
	const gridRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		console.log(gridRef);
	}, [])

	return (
		<div>
			<TimeLine />
			<div className={styles.root} >
				{builds.map(build => {
					return (
						<motion.div
							key={build.id}
							animate={{
								paddingTop: active.includes(build.id) ? '40px' : 0,
								height: active.includes(build.id)
									? rooms.filter(room => room.section === build.id).length * 42
									: rooms.filter(room => room.section === build.id).length * 30,
							}}
							className={styles.buildGroup}
						>
							{rooms
								.filter(room => room.section === build.id)
								.map(room => {
									return (
										<motion.div
											key={room.id}
											animate={{ height: active.includes(build.id) ? 42 : 30 }}
											className={styles.roomLine}
										>
											{events
												.filter((event: AppEvent) => event.rooms === room.id)
												.map((event: AppEvent) => {

													// 	'dateFrom',
													// 	event.dateFrom.date(1).format('DD.MM.YYYY HH:mm')
													// );

													// 	'dateTo',
													// 	event.dateTo.date(1).format('DD.MM.YYYY HH:mm')
													// );
													//

													//

													// 	event.dateTo
													// 		.date(1)
													// 		.diff(event.dateFrom.date(1), 'minute') *
													// 		(1900 / 24 / 60)
													// );

													return (
														<motion.div
															ref={gridRef}
															className={styles.event}
															initial={{ opacity: 0 }}
															onClick={(e) => {
																// e.stopPropagation()
																e.preventDefault();
																console.log('Ну нажал')
																openModal(event, true)
															}}
															animate={{
																opacity: 1,
																cursor: 'pointer',
																// zIndex: 9999,
																backgroundColor: room.color,
																width:
																	event.dateTo
																		.date(1)
																		.diff(event.dateFrom.date(1), 'minute') *
																	(1900 / 24 / 60),
																x:
																	event.dateFrom.diff(
																		event.dateFrom.startOf('day'),
																		'minute'
																	) *
																		(1900 / 24 / 60) -
																	1900 / 24,
															}}
															exit={{ opacity: 0 }}
														>
															<p>{event.title}</p>
															<p>
																{event.dateFrom.date(1).format('DD.MM HH:mm')}-
																{event.dateTo.date(1).format('DD.MM HH:mm')}
															</p>
														</motion.div>
													);
												})}
										</motion.div>
									);
								})}
						</motion.div>
					);
				})}
			</div>
			<EventModal/>
		</div>
	);
};
