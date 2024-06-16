import styles from './App.module.scss';
import { useAppDispatch, useAppSelector } from './app/hook';
import { Grid } from './components/Grid/Grid';
import { Header } from './components/Header/Header';
import { Min } from './components/Min/Min';

function App() {
	const counter = useAppSelector(state => state.counter.value);
	const dispatch = useAppDispatch();

	return (
		<div className={styles.root}>
			<div className={styles.content}>
				<Header />
				<Grid />
			</div>
			<Min />
		</div>
	);
}

export default App;
