import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Radio } from 'antd';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import { Month, MonthsOf } from '../../consts';
import {
	decrementDay,
	decrementMonth,
	decrementWeek,
	incrementDay,
	incrementMonth,
	incrementWeek,
	selectToday,
} from '../../features/date/dateSlice';
import {
	selectCurrentDate,
	selectCurrentView,
} from '../../features/date/selectors';
import { changeView } from '../../features/view/viewSlice';
import styles from './Header.module.scss';
import useKeyPress from './hooks/useKeyPress';
import ReportButton from "../Modal/Report/Report";

export const Header = () => {
	const currentDate = useAppSelector(selectCurrentDate); // Получаем dayjs объект
	const currentView = useAppSelector(selectCurrentView);

	const dispatch = useAppDispatch();

	const changeDate = (e: string) => {
		switch (e) {
			case 'prev':
				if (currentView === 'day') {
					dispatch(decrementDay());
				}
				if (currentView === 'week') {
					dispatch(decrementWeek());
				}
				if (currentView === 'month') {
					dispatch(decrementMonth());
				}
				break;
			case 'next':
				if (currentView === 'day') {
					dispatch(incrementDay());
				}
				if (currentView === 'week') {
					dispatch(incrementWeek());
				}
				if (currentView === 'month') {
					dispatch(incrementMonth());
				}
				break;
			case 'today':
				dispatch(selectToday());
				break;
			default:
				break;
		}
	};

	const currentDateTitle = () => {
		switch (currentView) {
			case 'month':
				return `${Month[currentDate.month()]} ${currentDate.year()}`;
			case 'week':
				return `${currentDate.startOf('week').date()} - ${currentDate
					.endOf('week')
					.date()} ${MonthsOf[currentDate.month()]} ${currentDate.year()}`;
			case 'day':
				return `${currentDate.date()} ${
					MonthsOf[currentDate.month()]
				} ${currentDate.year()}`;
			default:
				return '';
		}
	};

	// Используем хук для обработки нажатий клавиш
	useKeyPress(['w', 'ц'], () => dispatch(changeView('week')));
	useKeyPress(['m', 'ь'], () => dispatch(changeView('month')));
	useKeyPress(['d', 'в'], () => dispatch(changeView('day')));

	return (
		<div className={styles.root}>
			<div className={styles.left}>

				<Radio.Group size='small' onChange={e => changeDate(e.target.value)}>
					<Radio.Button value='prev' onClick={() => changeDate('prev')}>
						<LeftOutlined />
					</Radio.Button>
					<Radio.Button value='today'>Сегодня</Radio.Button>
					<Radio.Button value='next' onClick={() => changeDate('next')}>
						<RightOutlined />
					</Radio.Button>
				</Radio.Group>
				<h1>{currentDateTitle()}</h1>
			</div>
			<div>
				<ReportButton/>

				<Radio.Group
					size='small'
					onChange={e => dispatch(changeView(e.target.value))}
				>
					<Radio.Button value='month'>Месяц</Radio.Button>
					<Radio.Button value='week'>Неделя</Radio.Button>
					<Radio.Button value='day'>День</Radio.Button>
				</Radio.Group>
			</div>
		</div>
	);
};
