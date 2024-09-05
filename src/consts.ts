import {Holiday} from "./types/type";
import dayjs from "dayjs";

export const WeekDay: Array<string> = [
	'Воскресенье',
	'Понедельник',
	'Вторник',
	'Среда',
	'Четверг',
	'Пятница',
	'Суббота',
];

export const Month: Array<string> = [
	'январь',
	'февраль',
	'март',
	'апрель',
	'май',
	'июнь',
	'июль',
	'август',
	'сентябрь',
	'октябрь',
	'ноябрь',
	'декабрь',
];

export const MonthsOf = [
	'Января',
	'Февраля',
	'Марта',
	'Апреля',
	'Мая',
	'Июня',
	'Июля',
	'Августа',
	'Сентября',
	'Октября',
	'Ноября',
	'Декабря',
];

export const holidays: Holiday[] = [
	{ id: 1, title: "Выходной", dateFrom: dayjs('2024-04-30'), dateTo: dayjs('2024-05-01'), description: "Государственный праздник" },
	{ id: 2, title: "Праздник Весны и Труда", dateFrom: dayjs('2024-05-01'), dateTo: dayjs('2024-05-02'), description: "Государственный праздник" },
	{ id: 3, title: "День Победы", dateFrom: dayjs('2024-05-09'), dateTo: dayjs('2024-05-10'), description: "Государственный праздник" },
	{ id: 4, title: "День Победы", dateFrom: dayjs('2024-05-10'), dateTo: dayjs('2024-05-11'), description: "Государственный праздник" },
	{ id: 5, title: "Новогодние каникулы", dateFrom: dayjs('2024-12-31'), dateTo: dayjs('2025-01-01'), description: "Государственный праздник" },
	{ id: 6, title: "Новогодние каникулы", dateFrom: dayjs('2024-01-03'), dateTo: dayjs('2024-01-04'), description: "Государственный праздник" },
	{ id: 7, title: "Новогодние каникулы", dateFrom: dayjs('2024-01-04'), dateTo: dayjs('2024-01-05'), description: "Государственный праздник" },
	{ id: 8, title: "Новогодние каникулы", dateFrom: dayjs('2024-01-06'), dateTo: dayjs('2024-01-07'), description: "Государственный праздник" },
	{ id: 9, title: "День России", dateFrom: dayjs('2024-06-12'), dateTo: dayjs('2024-06-13'), description: "Государственный праздник" },
	{ id: 10, title: "Новогодние каникулы", dateFrom: dayjs('2024-12-30'), dateTo: dayjs('2024-12-31'), description: "Государственный праздник" },
	{ id: 11, title: "Новый Год", dateFrom: dayjs('2024-01-01'), dateTo: dayjs('2024-01-02'), description: "Государственный праздник" },
	{ id: 12, title: "Новогодние каникулы", dateFrom: dayjs('2024-01-02'), dateTo: dayjs('2024-01-03'), description: "Государственный праздник" },
	{ id: 13, title: "Новогодние каникулы", dateFrom: dayjs('2024-01-05'), dateTo: dayjs('2024-01-06'), description: "Государственный праздник" },
	{ id: 14, title: "День защитника Отечества", dateFrom: dayjs('2024-02-23'), dateTo: dayjs('2024-02-24'), description: "Государственный праздник" },
	{ id: 15, title: "Восьмое марта", dateFrom: dayjs('2024-03-08'), dateTo: dayjs('2024-03-09'), description: "Государственный праздник" },
	{ id: 16, title: "Выходной", dateFrom: dayjs('2024-04-28'), dateTo: dayjs('2024-04-29'), description: "Государственный праздник" },
	{ id: 17, title: "День народного единства", dateFrom: dayjs('2024-11-04'), dateTo: dayjs('2024-11-05'), description: "Государственный праздник" },
	{ id: 18, title: "Рождество", dateFrom: dayjs('2024-01-07'), dateTo: dayjs('2024-01-08'), description: "Государственный праздник" },
	{ id: 19, title: "Выходной", dateFrom: dayjs('2024-04-29'), dateTo: dayjs('2024-04-30'), description: "Государственный праздник" },
	{ id: 20, title: "Выходной", dateFrom: dayjs('2024-11-03'), dateTo: dayjs('2024-11-04'), description: "Государственный праздник" },
	{ id: 21, title: "Новогодние каникулы", dateFrom: dayjs('2024-01-08'), dateTo: dayjs('2024-01-09'), description: "Государственный праздник" }
];
