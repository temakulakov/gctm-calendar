import {AppEvent} from "../types/event";
import dayjs from "dayjs";
import {AppRoom, ReportRoom} from "../types/Room";
import {alignToSameDay, calculateTimeDifference} from "./DateTime";


export const BXProcessedReportDay = (events: AppEvent[], room: AppRoom): ReportRoom => {
    const processedReport = {
        id: room.id,
        title: room.title,
        color: room.color,
        section: room.section,
        dateFrom: room.dateFrom,
        dateTo: room.dateTo,
        hours: 0,
        percents: 0,
    };

    let exhibitions = 0;
    let excursions = 0;

    events.forEach(event => {
        processedReport.hours += calculateTimeDifference(room.dateFrom, room.dateTo, event.dateFrom, event.dateTo);
        console.log('------------------------------')
        console.log('room.dateFrom' + room.dateFrom)
        console.log('room.dateTo' + room.dateTo)
        console.log('------------------------------')
        console.log('event.dateFrom' + event.dateFrom)
        console.log('event.dateTo' + event.dateTo)

        if (event.type === 57) exhibitions += 1;
        if (event.type === 58) excursions += 1;
        // if (event.type === 57) exhibitions += 1;
        // if (event.type === 57) exhibitions += 1;
    });

    processedReport.percents =  processedReport.hours / (alignToSameDay(room.dateTo).diff(alignToSameDay(room.dateFrom), 'minute') / 100) ;
    return {
        ...processedReport,
        exhibitions,
        excursions,
    };
}

export const BXProcesesedReportRange = (events: AppEvent[], room: AppRoom) => {

}

export const BXProcessedUsers = (data: BXUser[]): AppUser[] => {
    const processedUsers: AppUser[] = data.map((item, index) => {
        return {
            id: Number(item.ID),
            name: `${item.LAST_NAME} ${item.NAME} ${item.SECOND_NAME}`,
            imageUrl: item.PERSONAL_PHOTO
        };
    });

    return processedUsers;
}

export const BXProcessedBuilds = (data: BXBuild[]): AppBuild[] => {
    const processedBuilds = data.map((item, index) => {
        return {
            id: Number(item.ID),
            title: item.NAME
        }
    });

    return processedBuilds;
}


export const BXProcessedRooms = (data: BXRoom[]): AppRoom[] => {
    const processedRooms = data.map((item, index) => {
        return {
            id: Number(item.ID),
            color: item.PROPERTY_315 ? item.PROPERTY_315[Object.keys(item.PROPERTY_315)[0]] : '', // Safely access PROPERTY_315
            title: item.NAME,
            section: Number(item.IBLOCK_SECTION_ID),
            dateFrom: item.PROPERTY_312 ? dayjs(item.PROPERTY_312[Object.keys(item.PROPERTY_312)[0]]) : dayjs(), // Safely access PROPERTY_312
            dateTo: item.PROPERTY_313 ? dayjs(item.PROPERTY_313[Object.keys(item.PROPERTY_313)[0]]) : dayjs(), // Safely access PROPERTY_313
        }
    })
    return processedRooms;
}

export const BXProcessedEvents = (data: BXEvent[]): AppEvent[] => {

    const processedEvents: AppEvent[] = data.map((item, index) => {
        return {
            id: Number(item.ID),
            title: item.TITLE,
            stageId: item.STAGE_ID || '',
            opportunity: item.OPPORTUNITY || '',
            responsibleStaffList: item.UF_CRM_1725535570 ? item.UF_CRM_1725535570 : [],
            dateFrom: dayjs(item.UF_CRM_1725425014), // Изменено для правильного поля
            dateTo: dayjs(item.UF_CRM_1725425039), // Изменено для правильного поля
            type: Number(item.UF_CRM_1725447833) || 0, // Дополнение для типа
            duration: item.UF_CRM_1725461803 || '', // Дополнение для длительности
            rooms: Number(item.UF_CRM_1725448271) || 0, // Дополнение для комнат
            seatsCount: Number(item.UF_CRM_1725464299) || 0, // Количество мест
            contractType: Number(item.UF_CRM_1725448865) || 0, // Тип контракта
            price: item.OPPORTUNITY || '', // Цена
            requisites: item.UF_CRM_1725464394 || '', // Реквизиты
            actionPlaces: Number(item.UF_CRM_1725448176) , // Места действия
            technicalSupportRequired: String(item.UF_CRM_1725464426) === '1' ? true : false, // Техническая поддержка
            comments: item.UF_CRM_1725464456 || '', // Комментарии
            eventDetails: item.UF_CRM_1725522371 || '', // Детали события
            contactFullName: item.UF_CRM_1725464495 || '', // Полное имя контакта
            assignedById: Number(item.ASSIGNED_BY_ID) || 0, // Ответственный сотрудник
            description: item.UF_CRM_1725522371 || '', // Описание события
            techSupportNeeds: item.UF_CRM_1725522431 || '', // Потребности в техподдержке
            published: item.UF_CRM_1725450210 || [], // Площадки для публикация
            ages: item.UF_CRM_1725522651 || [], // Возрастной рейтинг

        };
    });
    return processedEvents;
}

