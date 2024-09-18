import styles from './App.module.scss';
import { useAppDispatch, useAppSelector } from './app/hook';
import { Grid } from './components/Grid/Grid';
import { Header } from './components/Header/Header';
import { Min } from './components/Min/Min';
import axios from "axios";
import dayjs, {Dayjs} from "dayjs";
import {BXResponse, RoomData} from "./types/type";
import {Avatar, Select, Button} from "antd";
import {useState} from "react";
import EventModal from "./components/Modal/Event/EventModal";
import {AppEvent} from "./types/event";
import {useModalContext} from "./contexts/ModalContext";
const { Option } = Select;

function App() {

	const [selectedIds, setSelectedIds] = useState<number[]>([]);

	const handleChange = (value: number[]) => {
		setSelectedIds(value); // value будет массивом выбранных id
	};


	const { openModal } = useModalContext();



	return (
		<div className={styles.root}>
			{/*<Button type="primary" onClick={() => openModal(null, true)}>*/}
			{/*	Создать событие*/}
			{/*</Button>*/}
			{/*<Button type="default" onClick={() => openModal(sampleEvent, true)}>*/}
			{/*	Редактировать событие*/}
			{/*</Button>*/}
			{/*<Button type="default" onClick={() => openModal(sampleEvent, false)}>*/}
			{/*	Просмотреть событие*/}
			{/*</Button>*/}

			{/*<EventModal />*/}


			<div className={styles.content}>
				<Header />
				<Grid />
			</div>
			<Min />
		</div>
	);
}

export default App;
