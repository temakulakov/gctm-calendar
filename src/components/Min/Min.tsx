import { Calendar, ConfigProvider } from 'antd';
import ruRU from 'antd/lib/locale/ru_RU';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ru';
import localeData from 'dayjs/plugin/localeData';
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import { selectDate } from '../../features/date/dateSlice';
import { Filters } from './Filters/Filters';
import styles from './Min.module.scss';
dayjs.locale('ru');
dayjs.extend(localeData);

export const Min = () => {
	const dispatch = useAppDispatch();
	const currentDate = useAppSelector(state => dayjs(state.date.value));

	const selectCurrentDate = (date: Dayjs) => {
		dispatch(selectDate(date.toISOString()));
	};

	React.useEffect(() => {
		console.log(currentDate.format('DD.MM.YYYY'));
	}, [currentDate]);

	return (
		<div className={styles.root}>
			<ConfigProvider locale={ruRU}>
				<Calendar
					value={currentDate}
					onSelect={selectCurrentDate}
					fullscreen={false}
				/>
				<Filters />
			</ConfigProvider>
		</div>
	);
};
