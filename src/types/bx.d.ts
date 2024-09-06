interface BXUser {
    ID: string;
    PERSONAL_PHOTO: string;
    NAME: string;
    LAST_NAME: string;
    SECOND_NAME: string;
}

interface BXUserField {
    ID: string;     // ID как число
    FIELD_NAME: string;  // FIELD_NAME как строка
    LIST?: ListItemAPI[]; // Массив элементов списка
}

interface ListItemAPI {
    ID: string;     // ID как число
    VALUE: string;  // FIELD_NAME как строка
}



interface BXBuild {
    ID: string;
    NAME: string;
}


interface BXRoom {
    ID: string;                              // Идентификатор события
    IBLOCK_ID: string;                       // Идентификатор информационного блока
    NAME: string;                            // Название события
    IBLOCK_SECTION_ID: string;               // Идентификатор раздела информационного блока
    CREATED_BY: string;                      // Идентификатор создателя
    BP_PUBLISHED: "Y" | "N";                 // Статус публикации
    CODE: string | null;                     // Код события (может быть null)
    PROPERTY_312: { [key: string]: string }; // Дата и время начала
    PROPERTY_313: { [key: string]: string }; // Дата и время окончания
    PROPERTY_315: { [key: string]: string }; // Цветовой код
}

interface BXEvent {
    ID: string; // Идентификатор события
    TITLE: string; // Название мероприятия
    STAGE_ID: string; // Идентификатор стадии
    OPPORTUNITY: string; // Возможности (например, денежная сумма)
    ASSIGNED_BY_ID: string; // Идентификатор назначенного пользователя
    UF_CRM_1725425014: string; // Дата и время начала мероприятия (ISO формат)
    UF_CRM_1725425039: string; // Дата и время окончания мероприятия (ISO формат)
    UF_CRM_1725447833: string; // Поле с кастомным значением (например, числовой идентификатор)
    UF_CRM_1725461803: string; // Продолжительность мероприятия
    UF_CRM_1725448176: string; // Идентификатор другого объекта (например, зала)
    UF_CRM_1725448271: string; // Идентификатор связанного события
    UF_CRM_1725464299: string; // Кастомное поле с идентификатором
    UF_CRM_1725448865: string; // Дополнительное поле (например, идентификатор)
    UF_CRM_1725535570: number[]; // Массив значений (например, множественные идентификаторы)
    UF_CRM_1725464394: string; // Реквизиты мероприятия
    UF_CRM_1725450210: number[]; // Массив идентификаторов (например, участников)
    UF_CRM_1725464426: string; // Статус мероприятия
    UF_CRM_1725464456: string; // Комментарии
    UF_CRM_1725464469: string; // Описание происходящего
    UF_CRM_1725464495: string | null; // Дополнительное поле (может быть null)
    UF_CRM_1725522371: string; // Описание мероприятия
    UF_CRM_1725522431: string; // Требования для мероприятия
    UF_CRM_1725522651: number[]; // Массив значений (например, идентификаторы ресурсов)
}

interface BXResponce<T> {
    result: T[];        // Сама дата
    total: number;      // Количество элементов в ответе
    time: object;       // Время запроса
    next?: number;
}

interface BXRequest<T, C> {
    select: T[]; // Выборка
    filter?: C; // Фильтр
}


