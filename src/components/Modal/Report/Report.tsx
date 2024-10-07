import React, { useState } from 'react';
import {Button, Modal, DatePicker, Table, TableColumnsType, ConfigProvider} from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';
import { useQuery } from "@tanstack/react-query";
import { AppEvent } from "../../../types/event";
import { getBuilds, getEvents, getRooms } from "../../../services/bx";
import { Build, Room } from "../../../types/type";
import { ReportRoom } from '../../../types/Room';
import { BXProcesesedReportRange } from "../../../utils/bx.processed";
import  "dayjs/locale/ru";
import ruLocale from 'antd/lib/locale/ru_RU';

import { Bar } from 'react-chartjs-2';
import {Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartData} from 'chart.js';

// Регистрация компонентов Chart.js
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Устанавливаем русскую локализацию для dayjs
dayjs.locale('ru');

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
            setDateRange([null, null]);
        }
    };

    // Столбцы для отчета по комнатам
    const roomColumns: TableColumnsType<ReportRoom> = [
        { title: 'Места проведения', dataIndex: 'title', key: 'title', align: 'left', width: 200 },
        { title: 'Количество часов', dataIndex: 'hours', key: 'hours', align: 'right', width: 150 },
        { title: 'Процент занятости', dataIndex: 'percents', key: 'percents', align: 'right', width: 150, render: (percents) => `${percents}%` },
        { title: 'Экскурсии', dataIndex: 'excursions', key: 'excursions', align: 'right', width: 150 },
        { title: 'Выставки', dataIndex: 'exhibitions', key: 'exhibitions', align: 'right', width: 150 },
    ];

    const getChartData = () => {
        if (!buildsWithAggregatedData) return null;

        const labels = buildsWithAggregatedData.map(build => build.title);
        const totalHours = buildsWithAggregatedData.map(build => build.totalHours);
        const totalExcursions = buildsWithAggregatedData.map(build => build.totalExcursions);
        const totalExhibitions = buildsWithAggregatedData.map(build => build.totalExhibitions);

        return {
            labels,
            datasets: [
                {
                    label: 'Количество часов',
                    data: totalHours,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                },
                {
                    label: 'Экскурсии',
                    data: totalExcursions,
                    backgroundColor: 'rgba(153, 102, 255, 0.6)',
                },
                {
                    label: 'Выставки',
                    data: totalExhibitions,
                    backgroundColor: 'rgba(255, 159, 64, 0.6)',
                },
            ],
        };
    };


    const reportData: ReportRoom[] = rooms.map((room) =>
        BXProcesesedReportRange(
            events.filter((event) => event.rooms === room.id),
            room,
            dateRange[0] !== null ? dateRange[0] : dayjs(),
            dateRange[1] !== null ? dateRange[1] : dayjs()
        )
    );

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

    const buildsWithAggregatedData = builds?.map((build) => {
        const aggregatedData = getAggregatedDataForBuild(build.id);
        return {
            ...build,
            totalHours: aggregatedData.totalHours,
            totalExcursions: aggregatedData.totalExcursions,
            totalExhibitions: aggregatedData.totalExhibitions,
            averageOccupancy: aggregatedData.averageOccupancy,
            relatedRooms: aggregatedData.relatedRooms
        };
    });

    // Столбцы для отчетов по зданиям
    const buildColumns: TableColumnsType<Build & { totalHours: number; averageOccupancy: number; totalExcursions: number; totalExhibitions: number; relatedRooms: ReportRoom[]; }> = [
        { title: 'Здание', dataIndex: 'title', key: 'title', align: 'left', width: 200 },
        { title: 'Количество часов (сумма)', dataIndex: 'totalHours', key: 'totalHours', align: 'right', width: 150 },
        { title: 'Процент занятости (среднее)', dataIndex: 'averageOccupancy', key: 'averageOccupancy', align: 'right', width: 150, render: (value) => `${value}%` },
        { title: 'Экскурсии (сумма)', dataIndex: 'totalExcursions', key: 'totalExcursions', align: 'right', width: 150 },
        { title: 'Выставки (сумма)', dataIndex: 'totalExhibitions', key: 'totalExhibitions', align: 'right', width: 150 },
    ];

    const downloadExcel = () => {
        const worksheetData: Array<any> = [];

        buildsWithAggregatedData?.forEach(build => {
            worksheetData.push({
                'Здание': build.title,
                'Количество часов': build.totalHours,
                'Процент занятости': `${build.averageOccupancy}%`,
                'Экскурсии': build.totalExcursions,
                'Выставки': build.totalExhibitions
            });

            build.relatedRooms.forEach(room => {
                worksheetData.push({
                    'Здание': `   - ${room.title}`,
                    'Количество часов': room.hours,
                    'Процент занятости': `${room.percents}%`,
                    'Экскурсии': room.excursions,
                    'Выставки': room.exhibitions
                });
            });
        });

        const ws = XLSX.utils.json_to_sheet(worksheetData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Отчет');
        XLSX.writeFile(wb, 'отчет_мероприятий.xlsx');
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
                style={{ maxHeight: '80vh', overflowY: 'scroll',  height: 'fit-content', paddingBottom: 20}}
            >
                <ConfigProvider locale={ruLocale}>
                <RangePicker
                    style={{ width: '100%' }}
                    onChange={onDateChange}
                    value={dateRange}
                    placeholder={['Начальная дата', 'Конечная дата']}
                />
                </ConfigProvider>
                {
                    dateRange[0] && dateRange[1] && (
                        <>
                            <Button
                                icon={<DownloadOutlined />}
                                style={{ marginBottom: 16, marginTop: 16 }}
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
                                                        style={{ marginLeft: '20px' }} // Отступ для вложенных строк
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

                            {
                                // events && rooms && buildsWithAggregatedData && (
                                //     <>
                                //         {getChartData() ? (
                                //             <Bar
                                //                 data={getChartData() as ChartData<"bar", number[], string>} // Приведение типов, если вы уверены, что данные есть
                                //                 options={{
                                //                     indexAxis: 'y',
                                //                     responsive: true,
                                //                     plugins: {
                                //                         legend: {
                                //                             position: 'right',
                                //                         },
                                //                         title: {
                                //                             display: true,
                                //                             text: 'Анализ по зданиям',
                                //                         },
                                //                     },
                                //                 }}
                                //             />
                                //         ) : (
                                //             <p>Нет данных для отображения графика.</p>
                                //         )}
                                //     </>
                                // )
                            }

                        </>
                    )
                }
            </Modal>
        </>
    );
};

export default ReportButton;
