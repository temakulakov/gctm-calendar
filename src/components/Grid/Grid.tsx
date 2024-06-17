import { useAppSelector } from '../../app/hook';
import styles from './Grid.module.scss';
import { Day } from './views/Day/Day';
import { Month } from './views/Month/Month';
import { Week } from './views/Week/Week';

export const Grid = () => {
	const currentView = useAppSelector(state => state.view.value);

	const GridJSX = () => {
		switch (currentView) {
			case 'day':
				return <Day />;
			case 'week':
				return <Week />;
			case 'month':
				return <Month />;
			default:
				return <></>;
		}
	};

	return <div className={styles.root}>{GridJSX()}</div>;
};
