import React, { useState } from 'react';
import {Button, Modal, DatePicker, Table} from 'antd';
import dayjs from 'dayjs';
import {useQuery} from "@tanstack/react-query";
import {AppEvent} from "../../../types/event";
import {getBuilds, getEvents, getRooms} from "../../../services/bx";
import {Build, Room} from "../../../types/type";

const { RangePicker } = DatePicker;

const ReportButton = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const { data: events } = useQuery<AppEvent[]>({
        queryKey: ['events', 'report', dateRange[0], dateRange[1]],
        queryFn: () =>
            getEvents(
                dateRange[0] ? dateRange[0] : dayjs().endOf('month'),
                dateRange[1] ? dateRange[1] : dayjs().endOf('month'),
            ),
        initialData: [],
    });

    const { data: rooms } = useQuery<Room[]>({
        queryKey: ['rooms'],
        queryFn: () => getRooms(),
        initialData: [],
    });

    const { data: builds } = useQuery<Build[]>({
        queryKey: ['build'],
        queryFn: () => getBuilds(),
        initialData: [],
    });

    const handleOk = () => {
        console.log('Выбранный диапазон дат:', dateRange);
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const onDateChange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null, dateStrings: [string, string]) => {
        if (dates) {
            setDateRange(dates);
        } else {
            setDateRange([null, null]); // Сбрасываем, если dates равен null
        }
        console.log('Строки дат:', dateStrings);
    };

    return (
        <>
            <Button size="small" onClick={showModal}>
                Формирование отчета
            </Button>
            <Modal
                title="Формирование отчета"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                width="90%"
                bodyStyle={{ height: '90vh' }} // Устанавливаем высоту модального окна
            >
                <RangePicker
                    style={{ width: '100%' }}
                    onChange={onDateChange}
                    value={dateRange} // Устанавливаем значение для контролируемого компонента
                    placeholder={['Начальная дата', 'Конечная дата']} // Тексты на русском языке
                />
                {
                    dateRange[0] && dateRange[1] && <Table></Table>
                }
            </Modal>
        </>
    );
};

export default ReportButton;
