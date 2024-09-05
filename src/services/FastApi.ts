import axios from 'axios';
import dayjs from 'dayjs';
import {
	Build, BXResponse,
	DateFrom,
	DateRange, EventData,
	GoogleUrl,
	Holiday,
	IEvent,
	ReportRoom,
	Room,
} from '../types/type';

const api = axios.create({
	baseURL: 'http://185.247.18.121:8000/calendar/',
});


const getUsers = () => {

}


// The getRooms function now calls the specified API and processes the data accordingly
export const getRooms = async (): Promise<Room[]> => {
		const response = await axios.post("https://intranet.bakhrushinmuseum.ru/rest/3/ynm1gnbjjm2kf4vk/lists.element.get.json", {
		IBLOCK_TYPE_ID: "lists",
		IBLOCK_ID: "80",
		SECTION_ID: "0"
	});



	const data = response.data;

	if (!data.result) {
		throw new Error("Unexpected response format");
	}


	const processedItems: Room[] = data.result.map((item: any) => ({
		id: Number(item.ID),
		color: item.PROPERTY_315 ? item.PROPERTY_315[Object.keys(item.PROPERTY_315)[0]] : '', // Safely access PROPERTY_315
		title: item.NAME,
		section: Number(item.IBLOCK_SECTION_ID),
		dateFrom: item.PROPERTY_312 ? dayjs(item.PROPERTY_312[Object.keys(item.PROPERTY_312)[0]]) : null, // Safely access PROPERTY_312
		dateTo: item.PROPERTY_313 ? dayjs(item.PROPERTY_313[Object.keys(item.PROPERTY_313)[0]]) : null, // Safely access PROPERTY_313
	}));
	return processedItems;
};

export const getGoogleCalendar = async (
	googleUrl: GoogleUrl = {
		googleUrl:
			'https://calendar.google.com/calendar/ical/ru.russian%23holiday%40group.v.calendar.google.com/public/basic.ics',
	}
): Promise<Holiday[]> => {
	const response = await api.post<{ data: Holiday[] }>('/google', googleUrl);
	return response.data.data; // Вернуть данные о праздниках
};

export const getReportDay = async (
	dateFrom: DateFrom
): Promise<ReportRoom[]> => {
	const date = dateFrom.dateFrom.add(1, 'day');
	const response = await api.post<{ data: ReportRoom[] }>('/report/day', {
		dateFrom: date,
	});
	return response.data.data;
};

export const getReportRange = async ({
										 dateFrom,
										 dateTo,
									 }: DateRange): Promise<ReportRoom[]> => {
	const response = await api.post<{ data: ReportRoom[] }>('/report/range', {
		dateFrom: dateFrom.startOf('day'),
		dateTo: dateTo.endOf('day'),
	});
	return response.data.data;
};

export const getBuilds = async (): Promise<Build[]> => {
	// Define the URL and parameters for the API request
	const url = "https://intranet.bakhrushinmuseum.ru/rest/3/ynm1gnbjjm2kf4vk/lists.section.get.json";
	const params = {
		IBLOCK_TYPE_ID: "lists",
		IBLOCK_ID: "80"
	};

	try {
		// Make the POST request to the API
		const response = await axios.post(url, params);



		// Check if the 'result' field exists in the response data
		const data = response.data;
		if (!data.result) {
			throw new Error("Unexpected response format");
		}


		// Process the response data and map it to the Build type
		const processedItems: Build[] = data.result.map((item: any) => ({
			id: Number(item.ID),
			title: item.NAME
		}));



		// Return the processed items
		return processedItems;
	} catch (error) {
		// Handle any errors that occur during the request
		throw new Error(`Failed to fetch data from the provided URL: ${error}`);
	}
};



export const getEvents = async (dateRange: DateRange): Promise<IEvent[]> => {
	// Set the date range boundaries
	const dateFrom = dateRange.dateFrom.startOf('day').toISOString();
	const dateTo = dateRange.dateTo.endOf('day').toISOString();

	const eventsParams = {
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
			'>=UF_CRM_1725425014': dateFrom,
			'<=UF_CRM_1725425039': dateTo
		}
	};
	// Fetch events from the API
	try {
		const response = await axios.post<BXResponse<EventData>>('https://intranet.bakhrushinmuseum.ru/rest/3/ynm1gnbjjm2kf4vk/crm.deal.list', eventsParams);
		const data = response.data;


		if (!data.result) {
			throw new Error('Unexpected response format');
		}
		console.log(data.result)

		// Process and return the transformed event data

		// return transformEventDates(data.result);
		return transformEventDates(data.result);

	} catch (error) {
		throw new Error(`Failed to fetch events: ${error}`);
	}
};


const transformEventDates = (events: EventData[]): IEvent[] => {
	return events.map(item => ({
		id: Number(item.ID),
		title: item.TITLE,
		stageId: item.STAGE_ID,
		opportunity: item.OPPORTUNITY,
		responsibleStaffList: item.UF_CRM_1725535570 ? item.UF_CRM_1725535570 : [],
		dateFrom: dayjs(item.UF_CRM_1725425014), // Изменено для правильного поля
		dateTo: dayjs(item.UF_CRM_1725425039), // Изменено для правильного поля
		type: item.UF_CRM_1725447833 || '', // Дополнение для типа
		duration: item.UF_CRM_1725461803 || '', // Дополнение для длительности
		// department: Number(item.UF_CRM_1715507748) || 0,
		rooms: Number(item.UF_CRM_1725448271) || 0, // Дополнение для комнат
		seatsCount: Number(item.UF_CRM_1725464299) || 0, // Количество мест
		contractType: item.UF_CRM_1725448865 || '', // Тип контракта
		price: item.OPPORTUNITY || '', // Цена
		requisites: item.UF_CRM_1725464394 || '', // Реквизиты
		actionPlaces: Number(item.UF_CRM_1725448271) , // Места действия
		technicalSupportRequired: item.UF_CRM_1725522431 || '', // Техническая поддержка
		comments: item.UF_CRM_1725464456 || '', // Комментарии
		eventDetails: item.UF_CRM_1725522371 || '', // Детали события
		contactFullName: item.UF_CRM_1725464495 || '', // Полное имя контакта
		assignedById: Number(item.ASSIGNED_BY_ID) || 0, // Ответственный сотрудник
		createdBy: Number(item.UF_CRM_1725535570[0]) || 0, // Создатель
		description: item.UF_CRM_1725522371 || '', // Описание события
		techSupportNeeds: item.UF_CRM_1725522431 || '' // Потребности в техподдержке
	}));
};

