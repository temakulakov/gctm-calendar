import dayjs, {Dayjs} from "dayjs";
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);
// Функция для приведения объекта dayjs к определенному дню
export const alignToSameDay = (time: Dayjs) => {
    return time.year(dayjs().year()).month(dayjs().month()).date(dayjs().date());
};

// Функция для расчета времени между двумя объектами dayjs с учетом промежутка
export const calculateTimeDifference = (startInterval: Dayjs, endInterval: Dayjs, time1: Dayjs, time2: Dayjs): number => {
    // Приводим все объекты к одной дате
    const alignedStartInterval = alignToSameDay(startInterval);
    const alignedEndInterval = alignToSameDay(endInterval);
    const alignedTime1 = alignToSameDay(time1);
    const alignedTime2 = alignToSameDay(time2);

    // Выбираем максимальное начало между startInterval и time1
    const adjustedStart = alignedStartInterval.isAfter(alignedTime1) ? alignedStartInterval : alignedTime1;

    // Выбираем минимальный конец между endInterval и time2
    const adjustedEnd = alignedEndInterval.isBefore(alignedTime2) ? alignedEndInterval : alignedTime2;

    // Проверяем, что конец периода позже его начала
    if (adjustedEnd.isAfter(adjustedStart)) {
        // Рассчитываем разницу в минутах между скорректированными началом и концом
        return adjustedEnd.diff(adjustedStart, 'minute');
    } else {
        // Если интервал некорректен (начало позже конца)
        console.log('Интервал некорректен: конец интервала раньше или совпадает с началом');
        console.log(adjustedEnd);
        console.log(adjustedStart);

        return 0;
    }
};

