import React, { useState } from 'react';
import { Button, Modal, DatePicker, Table, TableColumnsType } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx'; // Импортируем библиотеку xlsx
import dayjs from 'dayjs';
import { useQuery } from "@tanstack/react-query";
import { AppEvent } from "../../../types/event";
import { getBuilds, getEvents, getRooms } from "../../../services/bx";
import { Build, Room } from "../../../types/type";
import { ReportRoom } from '../../../types/Room';
import {BXProcesesedReportRange, BXProcessedReportDay} from "../../../utils/bx.processed";

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

    };

    // Столбцы для отчета по комнатам (ReportRoom)
    const roomColumns: TableColumnsType<ReportRoom> = [
        { title: 'Места проведения', dataIndex: 'title', key: 'title' },
        { title: 'Количество часов', dataIndex: 'hours', key: 'hours' },
        { title: 'Процент занятости', dataIndex: 'percents', key: 'percents', render: (percents) => `${percents}%` },
        { title: 'Экскурсии', dataIndex: 'excursions', key: 'excursions' },
        { title: 'Выставки', dataIndex: 'exhibitions', key: 'exhibitions' },
    ];

    // Преобразуем комнаты в ReportRoom с агрегированными данными
    const reportData: ReportRoom[] = rooms.map((room) =>
        BXProcesesedReportRange(events.filter((event) => event.rooms === room.id), room, dateRange[0] !== null ? dateRange[0] : dayjs(), dateRange[1] !== null ? dateRange[1] : dayjs())

        // BXProcessedReportDay(events.filter((event) => event.rooms === room.id), room)
    );

    // Функция для вычисления суммы и среднего по дочерним комнатам для здания
    const getAggregatedDataForBuild = (buildId: number) => {
        const relatedRooms = reportData.filter(room => room.section === buildId);

        const totalHours = relatedRooms.reduce((acc, room) => acc + room.hours, 0);
        const totalExcursions = relatedRooms.reduce((acc, room) => acc + room.excursions, 0);
        const totalExhibitions = relatedRooms.reduce((acc, room) => acc + room.exhibitions, 0);
        const averageOccupancy = relatedRooms.length
            ? relatedRooms.reduce((acc, room) => acc + room.percents, 0) / relatedRooms.length
            : 0;

        return {
            totalHours,
            totalExcursions,
            totalExhibitions,
            averageOccupancy: Math.round(averageOccupancy),
            relatedRooms
        };
    };

    // Агрегированные данные для каждого здания
    const buildsWithAggregatedData = builds?.map((build) => {
        const aggregatedData = getAggregatedDataForBuild(build.id);
        return {
            ...build,
            totalHours: aggregatedData.totalHours,
            totalExcursions: aggregatedData.totalExcursions,
            totalExhibitions: aggregatedData.totalExhibitions,
            averageOccupancy: aggregatedData.averageOccupancy,
            relatedRooms: aggregatedData.relatedRooms // Добавляем комнаты, чтобы отображать их при развертывании
        };
    });

    // Столбцы для отчетов по зданиям (Build), включая агрегированные данные
    const buildColumns: TableColumnsType<Build & { totalHours: number; averageOccupancy: number; totalExcursions: number; totalExhibitions: number; relatedRooms: ReportRoom[]; }> = [
        { title: 'Здание', dataIndex: 'title', key: 'title' },
        { title: 'Количество часов (сумма)', dataIndex: 'totalHours', key: 'totalHours' },
        { title: 'Процент занятости (среднее)', dataIndex: 'averageOccupancy', key: 'averageOccupancy', render: (value) => `${value}%` },
        { title: 'Экскурсии (сумма)', dataIndex: 'totalExcursions', key: 'totalExcursions' },
        { title: 'Выставки (сумма)', dataIndex: 'totalExhibitions', key: 'totalExhibitions' },
    ];

    // Функция для скачивания таблицы в формате Excel с сохранением структуры
    const downloadExcel = () => {
        const worksheetData: Array<any> = [];

        // Проходим по каждому зданию и добавляем его и его залы
        buildsWithAggregatedData?.forEach(build => {
            // Добавляем данные о здании
            worksheetData.push({
                'Здание': build.title,
                'Количество часов': build.totalHours,
                'Процент занятости': `${build.averageOccupancy}%`,
                'Экскурсии': build.totalExcursions,
                'Выставки': build.totalExhibitions
            });

            // Добавляем данные о залах, относящихся к зданию
            build.relatedRooms.forEach(room => {
                worksheetData.push({
                    'Здание': `   - ${room.title}`, // Добавляем небольшой отступ для обозначения зала
                    'Количество часов': room.hours,
                    'Процент занятости': `${room.percents}%`,
                    'Экскурсии': room.excursions,
                    'Выставки': room.exhibitions
                });
            });
        });

        const ws = XLSX.utils.json_to_sheet(worksheetData); // Преобразуем данные в формат Excel
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Отчет');
        XLSX.writeFile(wb, 'отчет_мероприятий.xlsx'); // Сохраняем файл
    };

    return (
        <>
            <Button size="small" onClick={showModal} style={{ marginRight: 10 }}>
                Формирование отчета
            </Button>
            <Modal
                title="Формирование отчета"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                width="90%"
                bodyStyle={{ height: '90vh' }}
            >
                <RangePicker
                    style={{ width: '100%' }}
                    onChange={onDateChange}
                    value={dateRange}
                    placeholder={['Начальная дата', 'Конечная дата']}
                />
                {
                    dateRange[0] && dateRange[1] && (
                        <>
                            <Button
                                icon={<DownloadOutlined />}
                                style={{ marginBottom: 16 }}
                                onClick={downloadExcel}
                            >
                                Скачать отчет
                            </Button>
                            {
                                events && rooms && buildsWithAggregatedData && (
                                    <Table<Build & { totalHours: number; averageOccupancy: number; totalExcursions: number; totalExhibitions: number; relatedRooms: ReportRoom[]; }>
                                        columns={buildColumns}
                                        expandable={{
                                            expandedRowRender: (build) => {
                                                return (
                                                    <Table<ReportRoom>
                                                        columns={roomColumns}
                                                        dataSource={build.relatedRooms}
                                                        pagination={false}
                                                        rowKey="id"
                                                    />
                                                );
                                            },
                                            rowExpandable: (build) => build.relatedRooms.length > 0,
                                        }}
                                        dataSource={buildsWithAggregatedData}
                                        pagination={false}
                                        rowKey="id"
                                    />
                                )
                            }
                        </>
                    )
                }
            </Modal>
        </>
    );
};

export default ReportButton;
