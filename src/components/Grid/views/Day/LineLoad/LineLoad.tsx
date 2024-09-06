import { Badge, Popover } from 'antd';
import { ReportRoom } from '../../../../../types/type';
import styles from './LineLoad.module.scss';

import dayjs from 'dayjs';
import { motion } from 'framer-motion';

interface LineProps {
	data: ReportRoom | null;
}

const formatTime = (minutes: number): string => {
	const hours = Math.floor(minutes / 60); // Количество часов
	const remainingMinutes = minutes % 60; // Оставшиеся минуты

	if (hours > 0 && remainingMinutes > 0) {
		return `${hours} ч. ${remainingMinutes} мин.`;
	} else if (hours > 0) {
		return `${hours} ч.`;
	} else {
		return `${remainingMinutes} мин.`;
	}
};

export const LineLoad = ({ data }: LineProps) => {
	if (data)
		return (
			<Popover
				placement='right'
				title={data.title}
				content={
					<div>
						<p>
							Время работы:{' '}
							<b>
								{dayjs(data.dateFrom).format('HH:mm')} -{' '}
								{dayjs(data.dateTo).format('HH:mm')}
							</b>
						</p>
						<p>
							Время использования: <b>{formatTime(data.hours)}</b>
						</p>
						<p>
							Процент использования: <b>{data.percents.toFixed(1)}%</b>
						</p>
					</div>
				}
			>
				<Badge
					color={data.color}
					count={data.percents === 0 ? '' : `${data.percents.toFixed(0)}%`}
				>
					<motion.div
						className={styles.root}
						style={{ borderColor: data.color }}
						whileHover={{
							boxShadow: `${data.color} 0px 0px 0px 2px`,

							// scale: 1.01,
						}}
					>
						<motion.div
							initial={{ width: 0 }}
							animate={{ width: `${data.percents}%` }}
							exit={{ width: 0 }}
							className={styles.content}
							style={{ backgroundColor: data.color }}
						/>
					</motion.div>
				</Badge>
			</Popover>
		);
	else
		return (
			<motion.div className={styles.root} style={{}}>
				<motion.div
					initial={{ width: 0 }}
					exit={{ width: 0 }}
					className={styles.content}
				/>
			</motion.div>
		);
};
