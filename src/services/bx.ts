import axios from "axios";
import {AppEvent} from "../types/event";
import {
    BuildURL,
    BXApiUrl,
    BXRequestBuilds,
    BXRequestEventSelect,
    BXRequestRooms, EventAddURL, EventDeleteURL, EventUpdateURL,
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
import dayjs, { Dayjs } from "dayjs";
import {AppRoom, ReportRoom} from "../types/Room";
import {UserField} from "../types/type";

export const getFields = async (): Promise<UserField[]> => {
    const { data } = await axios.get<{ result: BXUserField[] }>('https://intranet.bakhrushinmuseum.ru/rest/3/ynm1gnbjjm2kf4vk/crm.deal.userfield.list');
    return data.result.map(field => ({
        id: parseInt(field.ID),
        title: field.FIELD_NAME,
        list: field.LIST?.map(item => ({
            id: parseInt(item.ID),
            title: item.VALUE
        }))
    }))
};

export const dayReport = async (events: AppEvent[], rooms: AppRoom[]): Promise<ReportRoom[]> => {
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

export const createEvent = async (event: Omit<AppEvent, 'id'>):  Promise<AppRoom[]> => {
    try {
        const { data } = await axios.post<BXResponce<BXRoom>>(BXApiUrl + EventAddURL, {
            fields: {
                TITLE: event.title,
                CATEGORY_ID: 1,
                UF_CRM_1725535570: event.responsibleStaffList,
                UF_CRM_1725425014: event.dateFrom,
                UF_CRM_1725425039: event.dateTo,
                UF_CRM_1725447833: event.type,
                UF_CRM_1725461803:`${dayjs(event.dateTo).diff(event.dateFrom, 'hours')} часов ${dayjs(event.dateTo).diff(event.dateFrom, 'minutes') % 60} минут`,
                UF_CRM_1725448176: event.actionPlaces,
                UF_CRM_1725448271: event.rooms,
                UF_CRM_1725464299: event.seatsCount,
                UF_CRM_1725448865: event.contractType,
                UF_CRM_1725464394: event.requisites,
                UF_CRM_1725450210: event.published,
                UF_CRM_1725464426: event.technicalSupportRequired,
                UF_CRM_1725464456: event.comments,
                UF_CRM_1725522431: event.techSupportNeeds,
                UF_CRM_1725522371: event.description,
                // UF_CRM_1725522431: event.
                UF_CRM_1725522651: event.ages
            }
        });
        return BXProcessedRooms(data.result);
    } catch (e) {
        console.error("Ошибка в запросе функции createEvent:", e);
        return [];
    };
}

export const deleteEvent = async (id: Number):  Promise<AppRoom[]> => {
    try {
        const { data } = await axios.post<BXResponce<BXRoom>>(BXApiUrl + EventDeleteURL, { id });
        return BXProcessedRooms(data.result);
    } catch (e) {
        console.error("Ошибка в запросе функции createEvent:", e);
        return [];
    };
}


export const updateEvent = async (event: AppEvent):  Promise<AppRoom[]> => {
    try {
        const { data } = await axios.post<BXResponce<BXRoom>>(BXApiUrl + EventUpdateURL, {
            id: event.id,
            fields: {
                TITLE: event.title,
                UF_CRM_1725535570: event.responsibleStaffList,
                UF_CRM_1725425014: event.dateFrom,
                UF_CRM_1725425039: event.dateTo,
                UF_CRM_1725447833: event.type,
                UF_CRM_1725461803:`${dayjs(event.dateTo).diff(event.dateFrom, 'hours')} часов ${dayjs(event.dateTo).diff(event.dateFrom, 'minutes') % 60} минут`,
                UF_CRM_1725448176: event.actionPlaces,
                UF_CRM_1725448271: event.rooms,
                UF_CRM_1725464299: event.seatsCount,
                UF_CRM_1725448865: event.contractType,
                UF_CRM_1725464394: event.requisites,
                UF_CRM_1725450210: event.published,
                UF_CRM_1725464426: event.technicalSupportRequired,
                UF_CRM_1725464456: event.comments,
                UF_CRM_1725522431: event.techSupportNeeds,
                UF_CRM_1725522371: event.description,
                // UF_CRM_1725522431: event.
                UF_CRM_1725522651: event.ages
            }
        });
        return BXProcessedRooms(data.result);
    } catch (e) {
        console.error("Ошибка в запросе функции updateEvent:", e);
        return [];
    };
}

