export const BXRequestEventSelect = [
    "ID",
    "TITLE",
    "STAGE_ID",
    "CREATED_BY",
    "OPPORTUNITY",
    "ASSIGNED_BY_ID",
    "UF_CRM_1714583071",
    "UF_CRM_1725425014",
    "UF_CRM_1725425039",
    "UF_CRM_1725447833",
    "UF_CRM_1725461803",
    "UF_CRM_1725448176",
    "UF_CRM_1725448271",
    "UF_CRM_1725464299",
    "UF_CRM_1725448865",
    "UF_CRM_1725535570",
    "UF_CRM_1725464394",
    "UF_CRM_1725450210",
    "UF_CRM_1725464426",
    "UF_CRM_1725464456",
    "UF_CRM_1725464469",
    "UF_CRM_1725464495",
    "UF_CRM_1725522371",
    "UF_CRM_1725522431",
    "UF_CRM_1725522651",
    "UF_CRM_1715508611",
];
//  TODO прокоментировать строки

export const BXRequestEventFilter = {
    "CATEGORY_ID": 1,
    // '!=STAGE_ID': 'C1:NEW',
    ">=UF_CRM_1725425014": "01.09.2024 10:00",  // Дата начала
    "<=UF_CRM_1725425039": "06.09.2024 16:00"   // Дата окончания
}

export const BXRequestRooms = {
    IBLOCK_TYPE_ID: "lists",
    IBLOCK_ID: "80",
    SECTION_ID: "0"
}

export const BXRequestBuilds = {
    IBLOCK_TYPE_ID: "lists",
    IBLOCK_ID: "80"
}

export const BuildURL = "lists.section.get.json";
export const RoomURL = "lists.element.get.json";


export const EventURL = "crm.deal.list";
export const EventUpdateURL = "crm.deal.update";
export const EventAddURL = "crm.deal.add";

export const UserURL = "user.get";

export const BXApiUrl = "https://intranet.bakhrushinmuseum.ru/rest/3/ynm1gnbjjm2kf4vk/";

export type BXRequestEventSelectType = typeof BXRequestEventSelect[number];
export type BXApiUrlType = typeof BXApiUrl;