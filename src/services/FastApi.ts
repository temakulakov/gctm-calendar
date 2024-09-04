import axios from 'axios';
import dayjs from 'dayjs';
import {
	Build,
	DateFrom,
	DateRange,
	GoogleUrl,
	Holiday,
	IEvent,
	ReportRoom,
	Room,
} from '../types/type';

const api = axios.create({
	baseURL: 'http://185.247.18.121:8000/calendar/',
});

const transformEventDates = (events: IEvent[]): IEvent[] => {
	return events.map(event => ({
		...event,
		dateFrom: dayjs(event.dateFrom),
		dateTo: dayjs(event.dateTo),
		rooms: Number(event.rooms),
	}));
};

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

export const getEvents = async (dateRange: DateRange): Promise<IEvent[]> => {
	const response = await api.post<{ data: IEvent[] }>('/events', dateRange);
	return transformEventDates(response.data.data);
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

		console.log(processedItems);

		// Return the processed items
		return processedItems;
	} catch (error) {
		// Handle any errors that occur during the request
		throw new Error(`Failed to fetch data from the provided URL: ${error}`);
	}
};
