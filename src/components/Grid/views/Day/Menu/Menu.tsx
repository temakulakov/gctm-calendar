import { Build, Holiday, Room } from '../../../../../types/type';
import styles from './Menu.module.scss';

interface MenuProps {
	rooms: Room[];
	builds: Build[];
	holidays: Holiday[];
	active: number[];
	setActive: React.Dispatch<React.SetStateAction<number[]>>;
}

export const Menu = ({
	rooms,
	builds,
	holidays,
	active,
	setActive,
}: MenuProps) => {
	return <div className={styles.root}></div>;
};
