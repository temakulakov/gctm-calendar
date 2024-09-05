import {Dayjs} from "dayjs";

export interface AppEvent {
    id: number;
    title: string;
    stageId: string;
    opportunity: string;
    responsibleStaffList: number[];
    dateFrom: Dayjs;
    dateTo: Dayjs;
    type: string;
    duration: string;
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
    description: string;
    techSupportNeeds: string;
}