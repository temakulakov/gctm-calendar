// types.ts

import { Dayjs } from 'dayjs';

export interface Room {
	id: number;
	color: string;
	title: string;
	section: number;
	dateFrom: Dayjs;
	dateTo: Dayjs;
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
	department: number;
	rooms: number;
	seatsCount: number;
	contractType: string;
	price: string;
	requisites: string;
	actionPlaces: number[];
	technicalSupportRequired: string;
	comments: string;
	eventDetails: string;
	contactFullName: string;
	assignedById: number;
	createdBy: number;
	description: string;
	techSupportNeeds: string;
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

export interface Build {
	id: number;
	title: string;
}
