import {Dayjs} from "dayjs";

export interface AppRoom {
    id: number;
    color: string | '';
    title: string;
    section: number;
    dateFrom: Dayjs;
    dateTo: Dayjs;
};

export interface ReportRoom extends AppRoom {
    hours: number;
    percents: number;
}