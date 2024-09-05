import styles from './App.module.scss';
import { useAppDispatch, useAppSelector } from './app/hook';
import { Grid } from './components/Grid/Grid';
import { Header } from './components/Header/Header';
import { Min } from './components/Min/Min';
import axios from "axios";
import dayjs, {Dayjs} from "dayjs";
import {BXResponse, RoomData} from "./types/type";

function App() {
	const counter = useAppSelector(state => state.counter.value);
	const dispatch = useAppDispatch();


	const get = (dateFrom: Dayjs, dateTo: Dayjs) => {
		const urlRooms = "https://intranet.bakhrushinmuseum.ru/rest/3/ynm1gnbjjm2kf4vk/lists.section.get.json";
		const urlEvents = "https://intranet.bakhrushinmuseum.ru/rest/3/ynm1gnbjjm2kf4vk/crm.deal.get";

		const paramsRooms = {
			IBLOCK_TYPE_ID: "lists",
			IBLOCK_ID: "80"
		};

		const paramsEvents = {
			select: [
				"ID", "TITLE", "STAGE_ID", "OPPORTUNITY", "UF_CRM_1714583071",
				"UF_CRM_1725425014", "UF_CRM_1725425039", "UF_CRM_1725447833",
				"UF_CRM_1725461803", "UF_CRM_1725448176", "UF_CRM_1725448271",
				"UF_CRM_1725464299", "UF_CRM_1725448865", "OPPORTUNITY", "UF_CRM_1725535570",
				"UF_CRM_1725464394", "UF_CRM_1725450210", "UF_CRM_1725464426",
				"UF_CRM_1725464456", "UF_CRM_1725464469", "UF_CRM_1725464495",
				"ASSIGNED_BY_ID", "CREATED_BY", "UF_CRM_1725522371", "UF_CRM_1725522431",
				'UF_CRM_1725522651', 'UF_CRM_1715508611'
			],
			filter: {
				CATEGORY_ID: 1,
				// '!=STAGE_ID': 'C1:NEW',
				'>=UF_CRM_1725425014': dateFrom.startOf('day'),
				'<=UF_CRM_1725425039': dateTo.endOf('day')
			}
		}
		// Запрос rooms
		try {
			const responceRooms = axios.post<BXResponse<RoomData>>(urlRooms, paramsRooms);
		} catch (e) {
			console.log(e)
		}

		// Запрос события
		try {
			const responceEvents = axios.post<BXResponse<RoomData>>(urlEvents, paramsEvents);
		} catch (e) {
			console.log(e)
		}
	}

	// get(dayjs(), dayjs());


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
