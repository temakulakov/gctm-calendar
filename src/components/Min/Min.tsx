import { Calendar, ConfigProvider } from 'antd';
import ruRU from 'antd/lib/locale/ru_RU';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ru';
import localeData from 'dayjs/plugin/localeData';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import { selectDate } from '../../features/date/dateSlice';
import { selectCurrentDate } from '../../features/date/selectors';
import { Filters } from './Filters/Filters';
import styles from './Min.module.scss';
dayjs.locale('ru');
dayjs.extend(localeData);

export const Min = () => {
	const dispatch = useAppDispatch();
	const currentDate = useAppSelector(selectCurrentDate); // Получаем dayjs объект

	const handleDateSelect = (date: Dayjs) => {
		dispatch(selectDate(date.toISOString()));
	};

	return (
		<div className={styles.root}>
			<ConfigProvider locale={ruRU}>
				<Calendar
					value={currentDate}
					onSelect={handleDateSelect}
					fullscreen={false}
				/>
				<Filters />
			</ConfigProvider>
		</div>
	);
};
