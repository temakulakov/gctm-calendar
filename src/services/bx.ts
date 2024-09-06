import axios from "axios";
import {AppEvent} from "../types/event";
import {
    BuildURL,
    BXApiUrl,
    BXRequestBuilds,
    BXRequestEventSelect,
    BXRequestRooms, EventUpdateURL,
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


// export const updateEvent = async (event: AppEvent) => {
//     try {
//         const dealData = {
//             TITLE: event.title,
//             CATEGORY_ID: 1,
//             // STAGE_ID: 'NEW',
//             UF_CRM_1714583071: event.responsibleStaffList,
//             UF_CRM_1725425014: event.dateFrom.format('YYYY-MM-DD HH:mm'),
//             UF_CRM_1725425039: event.dateTo.format('YYYY-MM-DD HH:mm'),
//             UF_CRM_1725447833: event.type ? event.type : 0,
//             UF_CRM_1725461803: event.duration ? event.duration : '',
//             UF_CRM_1725448176: event.sectionsState ? sectionsState.id : 0,
//             UF_CRM_1725448271: event.elementState ? elementState.id : 0,
//             UF_CRM_1725464299: event.places !== '' ? event.places : 0,
//             UF_CRM_1725448865: event.contract ? event.contract.id : 0,
//             OPPORTUNITY: event.opportunity !== '' ? event.opportunity : 0,
//             UF_CRM_1725464394: event.requisites,
//             UF_CRM_1725450210: event.actionPlaces,
//             UF_CRM_1725464456: event.comments,
//             UF_CRM_1725464469: event.techSupportNeeds,
//             UF_CRM_1725464495: event.contactFullName,
//             ASSIGNED_BY_ID: 1762,
//             CREATED_BY: event.selectedUsers[0],
//             UF_CRM_1725522371: event.description,
//             UF_CRM_1725522431: event.addTech,
//             UF_CRM_1725522651: event.age.map((el) => el.id),
//             UF_CRM_1725535570: event.selectedUsers
//         };
//         axios.post(BXApiUrl + EventUpdateURL, )
//     } catch (e) {
//         console.error("Ошибка в запросе функции updateEvent:", e);
//     }
// }

export const dayReport = async (events: AppEvent[], rooms: AppRoom[]): Promise<ReportRoom[]> => {
    const reports = rooms.map((item, index) => {
        return BXProcessedReportDay(events.filter(event => event.rooms === item.id), item);
    });
    console.log(events)
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