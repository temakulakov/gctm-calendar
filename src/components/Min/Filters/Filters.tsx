import { useQuery } from '@tanstack/react-query';
import { Checkbox, Collapse, ConfigProvider } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../app/hook';
import {
	setAllRooms,
	toggleRoom,
} from '../../../features/filters/filtersSlice';
import { getBuilds, getRooms } from '../../../services/FastApi';
import styles from './Filters.module.scss';

const { Panel } = Collapse;

export const Filters: React.FC = () => {
	const dispatch = useDispatch();
	const { selectedRooms } = useAppSelector(state => state.filters);
	console.log(selectedRooms);

	const { data: builds, isLoading: isLoadingBuilds } = useQuery({
		queryKey: ['builds'],
		queryFn: getBuilds,
	});

	const { data: rooms, isLoading: isLoadingRooms } = useQuery({
		queryKey: ['rooms'],
		queryFn: getRooms,
	});

	React.useEffect(() => {
		if (!isLoadingRooms && rooms) {
			const roomIds = rooms.map(room => room.id);
			dispatch(setAllRooms(roomIds));
			dispatch(toggleRoom(0));
		}
	}, [rooms, isLoadingRooms, dispatch]);

	const handleCheckboxChange = (roomId: number) => {
		dispatch(toggleRoom(roomId));
	};

	const defaultActiveKey = builds ? builds.map(build => build.id) : [];
	defaultActiveKey.push(0); // Добавить ключ для дополнительной панели

	return (
		<div className={styles.root}>
			{builds ? (
				<Collapse ghost defaultActiveKey={defaultActiveKey}>
					{builds.map(build => (
						<Panel header={build.title} key={build.id}>
							{rooms ? (
								rooms
									.filter(room => room.section === build.id)
									.map(room => (
										<div key={room.id}>
											<ConfigProvider
												theme={{
													token: {
														// Seed Token
														colorPrimary: room.color,
														borderRadius: 5,
													},
												}}
											>
												<Checkbox
													checked={selectedRooms.includes(room.id)}
													onChange={() => handleCheckboxChange(room.id)}
													style={{ width: '100%' }}
												>
													{room.title}
												</Checkbox>
											</ConfigProvider>
										</div>
									))
							) : (
								<>Loading</>
							)}
						</Panel>
					))}
					<Panel header={'Дополнительные календари'} key={0}>
						<ConfigProvider
							theme={{
								token: {
									// Seed Token
									colorPrimary: '#FFD800',
									borderRadius: 5,
								},
							}}
						>
							<div>
								<Checkbox
									checked={selectedRooms.includes(0)}
									onChange={() => handleCheckboxChange(0)}
									style={{ width: '100%' }}
								>
									{'Праздники'}
								</Checkbox>
							</div>
						</ConfigProvider>
					</Panel>
				</Collapse>
			) : (
				<></>
			)}
		</div>
	);
};

export default Filters;
