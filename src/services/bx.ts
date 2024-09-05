import axios from "axios";
import {AppEvent} from "../types/event";
import {
    BuildURL,
    BXApiUrl,
    BXRequestBuilds,
    BXRequestEventSelect,
    BXRequestRooms,
    EventURL,
    RoomURL, UserURL
} from "../consts/bx";
import {
    BXProcessedBuilds,
    BXProcessedEvents,
    BXProcessedReportDay,
    BXProcessedRooms,
    BXProcessedUsers
} from "../utils/bx.processed";
import { Dayjs } from "dayjs";
import {AppRoom, ReportRoom} from "../types/Room";


export const dayReport = (events: AppEvent[], rooms: AppRoom[]): ReportRoom[] => {
    const reports = rooms.map((item, index) => {
        return BXProcessedReportDay(events.filter(event => event.rooms === item.id), item);
    });
    return reports;
}

export const getUsers = async (): Promise<AppUser[]> => {
    const filter = {"user_type": "employee", "active": true};
    let next = 0;
    const responceUsers: BXUser[] = [];
    try {
        while (true) {
            const { data } = await axios.post<BXResponce<BXUser>>(BXApiUrl + UserURL, {
                start: next,
                filter
            });
            responceUsers.push(...data.result);
            next += 50;
            if (!data.next) {
                break;
            }
        }
    return BXProcessedUsers(responceUsers);
    } catch (e) {
        console.error("Ошибка в запросе функции getUsers:", e);
        return [];
    }
}



export const getBuilds = async ():  Promise<AppBuild[]> => {
    const params = BXRequestBuilds;
    try {
        const { data } = await axios.post<BXResponce<BXBuild>>(BXApiUrl + BuildURL, params);
        return BXProcessedBuilds(data.result);
    } catch (e) {
        console.error("Ошибка в запросе функции getBuilds:", e);
        return [];
    }
}

export const getRooms = async ():  Promise<AppRoom[]> => {
    const params = BXRequestRooms;
    try {
        const { data } = await axios.post<BXResponce<BXRoom>>(BXApiUrl + RoomURL, params);
        return BXProcessedRooms(data.result);
    } catch (e) {
    console.error("Ошибка в запросе функции getRooms:", e);
    return [];
};
}

export const getEvents = async ( dateFrom: Dayjs, dateTo: Dayjs): Promise<AppEvent[]> => {
    const params = {
        select: BXRequestEventSelect,
        filter: {
            CATEGORY_ID: 1,
            ">=UF_CRM_1725425014": dateFrom.toISOString(),  // Дата начала
            "<=UF_CRM_1725425039": dateTo.toISOString()   // Дата окончания
        }
    };

    try {
        const { data } = await axios.post<BXResponce<BXEvent>>(BXApiUrl + EventURL, params);

        return BXProcessedEvents(data.result);
    } catch (e) {
        console.error("Ошибка в запросе функции getEvents:", e);
        return [];
    };
};