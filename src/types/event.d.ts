import {Dayjs} from "dayjs";

export interface AppEvent {
    id: number;
    title: string;
    stageId: string;
    opportunity: string;
    responsibleStaffList: number[];
    dateFrom: Dayjs;
    dateTo: Dayjs;
    type: number;
    duration: string;
    rooms: number;
    seatsCount: number;
    contractType: number;
    price: string;
    requisites: string;
    actionPlaces: number;
    technicalSupportRequired: boolean;
    comments: string;
    eventDetails: string;
    contactFullName: string;
    assignedById: number;
    description: string;
    techSupportNeeds: string;
    published: number[];
    ages: number[];
}