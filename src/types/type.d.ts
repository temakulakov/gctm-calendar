// types.ts

import { Dayjs } from 'dayjs';

interface UserField {
	id: number;     // ID как число
	title: string;  // FIELD_NAME как строка
	list?: EventType[]; // Массив элементов списка
}

export interface EventType {
	id: number;
	title: string;
}

export interface Build {
	id: number;
	title: string;
}

export interface Room {
	id: number;
	color: string;
	title: string;
	section: number;
	dateFrom: Dayjs;
	dateTo: Dayjs;
}

export interface User {
	id: number;
	imageUrl: string;
	name: string;
}

export interface IEvent {
	id: number;
	title: string;
	stageId: string;
	opportunity: string;
	responsibleStaffList: number[];
	dateFrom: Dayjs;
	dateTo: Dayjs;
	type: string;
	duration: string;
	// department: number;
	rooms: number;
	seatsCount: number;
	contractType: string;
	price: string;
	requisites: string;
	actionPlaces: number;
	technicalSupportRequired: string;
	comments: string;
	eventDetails: string;
	contactFullName: string;
	assignedById: number;
	createdBy: number;
	description: string;
	techSupportNeeds: string;
}

export interface EventData {
	ASSIGNED_BY_ID: string;       // "1762"
	ID: string;                   // "34"
	OPPORTUNITY: string;          // "666.00"
	STAGE_ID: string;             // "C1:NEW"
	TITLE: string;                // "ВВЕДИТЕ НАЗВАНИЕ МЕРОПРИЯТИЯ"
	UF_CRM_1725425014: string;    // "2024-09-05T13:47:00+03:00"
	UF_CRM_1725425039: string;    // "2024-09-05T17:47:00+03:00"
	UF_CRM_1725447833: string;    // "26"
	UF_CRM_1725448176: string;    // "415"
	UF_CRM_1725448271: string;    // "6925"
	UF_CRM_1725448865: string;    // "32"
	UF_CRM_1725450210: number[];  // [35]
	UF_CRM_1725461803: string;    // "3 часов 59 минут"
	UF_CRM_1725464299: string;    // "999"
	UF_CRM_1725464394: string;    // "РЕКВИЗИТЫ"
	UF_CRM_1725464426: string;    // "1"
	UF_CRM_1725464456: string;    // "КОММЕНТАРИИ"
	UF_CRM_1725464469: string;    // "ЧТО БУДЕТ ПРОИСХОДИТЬ"
	UF_CRM_1725464495: string | null;  // null
	UF_CRM_1725522371: string;    // "ОПИСАНИЕ МЕРОПРИЯТИЯ"
	UF_CRM_1725522431: string;    // "ЧТО ТРЕБУЕТСЯ"
	UF_CRM_1725522651: number[];  // [39]
	UF_CRM_1725535570: number[];
}

export interface BXResponse<T> {
	result: T[];
	total: string;
	time: object;
}

export interface GoogleUrl {
	googleUrl: string;
}

export interface DateRange {
	dateFrom: Dayjs;
	dateTo: Dayjs;
}

export interface DateFrom {
	dateFrom: Dayjs;
}

export interface Holiday {
	id: number;
	title: string;
	dateFrom: Dayjs;
	dateTo: Dayjs;
	description: string;
}

export interface ReportRoom extends Room {
	hours: number;
	percents: number;
}

export interface Property  {
	[key: string]: string;
}

export interface RoomData {
	ID: string;
	IBLOCK_ID: string;
	NAME: string;
	IBLOCK_SECTION_ID: string;
	CREATED_BY: string;
	BP_PUBLISHED: string;
	CODE: string | null;
	PROPERTY_312: Property;
	PROPERTY_313: Property;
	PROPERTY_315: Property;
}
