import styles from './TimeLine.module.scss';

export const TimeLine = () => {
	const arr: number[] = Array.from({ length: 24 }, (_, i) => i + 1);
	return (
		<div className={styles.root}>
			{arr.map(el => {
				return <span key={el}>{el}</span>;
			})}
		</div>
	);
};
