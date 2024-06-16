import { Radio } from 'antd';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import { Month, MonthsOf } from '../../consts';
import { changeView } from '../../features/view/viewSlice';
import styles from './Header.module.scss';

export const Header = () => {
	const currentDate = useAppSelector(state => dayjs(state.date.value));
	const currentView = useAppSelector(state => state.view.value);

	const dispatch = useAppDispatch();

	const viewTextButton = () => {
		switch (currentView) {
			case 'day':
				return 'День';
			case 'week':
				return 'Неделя';
			case 'month':
				return 'Месяц';
		}
	};

	const currentDateTitle = () => {
		switch (currentView) {
			case 'month':
				return `${Month[currentDate.month()]} ${currentDate.year()}`;
			case 'week':
				return `${currentDate.startOf('week').date() + 1} - ${
					currentDate.endOf('week').date() + 1
				} ${MonthsOf[currentDate.month()]} ${currentDate.year()}`;
			case 'day':
				return `${currentDate.date()} ${
					MonthsOf[currentDate.month()]
				} ${currentDate.year()}`;
		}
	};

	return (
		<div className={styles.root}>
			<h1>{currentDateTitle()}</h1>
			<div>{viewTextButton()}</div>

			<Radio.Group onChange={e => dispatch(changeView(e.target.value))}>
				<Radio.Button value='month'>Месяц</Radio.Button>
				<Radio.Button value='week'>Неделя</Radio.Button>
				<Radio.Button value='day'>День</Radio.Button>
			</Radio.Group>
		</div>
	);
};
