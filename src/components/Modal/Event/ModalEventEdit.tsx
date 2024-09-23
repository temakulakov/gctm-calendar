import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, Avatar, Select, InputNumber, Checkbox, Row, Col } from 'antd';
import { useModalContext } from '../../../contexts/ModalContext';
import { AppEvent } from "../../../types/event";
import dayjs from "dayjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBuilds, getFields, getRooms, getUsers, updateEvent, deleteEvent } from "../../../services/bx"; // Убедитесь, что deleteEvent импортирован
import { DatePicker } from 'antd';
import { EventType } from "../../../types/type";
import { AppRoom } from "../../../types/Room";

const { RangePicker } = DatePicker;

const ModalEventEdit = () => {
    const { event, closeModal } = useModalContext();
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

    const { mutate: updateEventMutate } = useMutation({
        mutationFn: updateEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
            closeModal();
        },
        onError: (error) => {
            console.error('Ошибка при обновлении события:', error);
        },
    });

    const { mutate: deleteEventMutate } = useMutation({
        mutationFn: deleteEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
            closeModal();
        },
        onError: (error) => {
            console.error('Ошибка при удалении события:', error);
        },
    });

    const { data: roomsData } = useQuery({ queryKey: ['rooms'], queryFn: getRooms });
    const { data: buildsData } = useQuery({ queryKey: ['builds'], queryFn: getBuilds });
    const { data: users } = useQuery({ queryKey: ['users'], queryFn: getUsers });
    const { data: userFields, error } = useQuery({ queryKey: ['userFields'], queryFn: getFields });

    const [typeEvent, setTypeEvent] = React.useState<EventType[]>([]);
    const [contractType, setContractType] = React.useState<EventType[]>([]);
    const [publishType, setPublishType] = React.useState<EventType[]>([]);
    const [ageType, setAgeType] = React.useState<EventType[]>([]);

    useEffect(() => {
        if (event) {
            form.setFieldsValue({
                title: event.title,
                description: event.description,
                dateRange: [dayjs(event.dateFrom), dayjs(event.dateTo)],
                responsibleStaffList: event.responsibleStaffList,
                contractType: event.contractType,
                rooms: event.rooms,
                actionPlaces: event.actionPlaces,
                seatsCount: event.seatsCount,
                published: event.published,
                ages: event.ages,
                techSupportNeeds: event.techSupportNeeds,
                technicalSupportRequired: event.technicalSupportRequired,
                comments: event.comments,
                requisites: event.requisites,
                type: event.type,
            });
        }
    }, [event]);

    useEffect(() => {
        if (!error && userFields) {
            userFields.forEach(element => {
                if (element.id === 129 && element.list) setTypeEvent(element.list);
                if (element.id === 133 && element.list) setContractType(element.list);
                if (element.id === 134 && element.list) setPublishType(element.list);
                if (element.id === 144 && element.list) setAgeType(element.list);


            });
        }

    }, [userFields]);

    const handleSaveEvent = () => {
        form.validateFields().then(values => {
            const updatedEvent: AppEvent = {
                id: event ? event.id : 0,
                ...values,
                duration: `${dayjs(values.dateRange[1]).diff(dayjs(values.dateRange[0]), 'hour')} часов ${dayjs(values.dateRange[1]).diff(dayjs(values.dateRange[0]), 'minute') % 60} минут`,
                dateFrom: values.dateRange[0] || dayjs(),
                dateTo: values.dateRange[1] || dayjs(),
                assignedById: event ? event.assignedById : 0,
                contactFullName: event ? event.eventDetails : '',
                eventDetails: event ? event.eventDetails : '',
                opportunity: event ? event.opportunity : '',
                stageId: event ? event.stageId : '0',
                price: event ? event.price : '',
            };

            updateEventMutate(updatedEvent);
        }).catch(info => {
            console.log('Ошибка при валидации:', info);
        });
    };

    const handleDeleteEvent = () => {
        if (event) {
            deleteEventMutate(event.id);
        }
    };

    return (
        <Modal
            width={1000}
            title=""
            visible={true}
            onCancel={closeModal}
            footer={[
                <Button key="cancel" onClick={closeModal}>
                    Отмена
                </Button>,
                <Button key="delete" danger onClick={handleDeleteEvent}>
                    Удалить
                </Button>,
                <Button key="submit" type="primary" onClick={handleSaveEvent}>
                    Сохранить
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical">
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item label="Название мероприятия" name="title" rules={[{ required: true, message: 'Введите заголовок' }]}>
                            <Input placeholder="Введите заголовок события" />
                        </Form.Item>
                        <Form.Item label="Время проведения" name="dateRange" rules={[{ required: true, message: 'Введите время проведения' }]}>
                            <RangePicker
                                showTime
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                        <Row style={{ justifyContent: 'space-between' }}>
                            <Form.Item label="Ответственные сотрудники" name="responsibleStaffList" style={{width: '70%'}} rules={[{ required: true, message: 'Выберите сотрудников' }]}>
                                <Select mode="multiple" placeholder="Выберите сотрудников">
                                    {users && users.map(employee => (
                                        <Select.Option key={employee.id} value={employee.id} title={employee.name}>
                                            {employee.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item label="Возраст" style={{width: '25%'}} name="ages" rules={[{ required: true, message: 'Выберите возрастной рейтинг' }]}>
                                <Select mode="multiple" placeholder="Возрастной рейтинг">
                                    {ageType && ageType.map(item => (
                                        <Select.Option key={item.id} value={item.id} title={item.title}>
                                            {item.title}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Row>
                        <Row style={{ justifyContent: 'space-between', alignItems: 'center', margin: '10px 0' }}>
                            <Form.Item label="Используемый зал" name="rooms" style={{width: '48%'}} rules={[{ required: true, message: 'Выберите зал' }]}>
                                <Select placeholder="Выберите зал">
                                    {roomsData && roomsData.map(room => (
                                        <Select.Option key={room.id} value={room.id} title={room.title}>
                                            <Avatar style={{ backgroundColor: room.color, height: 17, width: 17, marginRight: 5, marginBottom: 4 }} />
                                            {room.title}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item label="Используемый филиал" name="actionPlaces" style={{width: '48%'}} rules={[{ required: true, message: 'Выберите филиал' }]}>
                                <Select placeholder="Выберите филиал">
                                    {buildsData && buildsData.map(build => (
                                        <Select.Option key={build.id} value={build.id} title={build.title}>
                                            {build.title}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Row>
                        <Form.Item label="Описание" name="description">
                            <Input.TextArea placeholder="Введите описание события" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Публикации для площадок" name="published" rules={[{ required: true, message: 'Выберите публикации' }]}>
                            <Select mode="multiple" placeholder="Площадки для публикации" style={{ width: '100%' }}>
                                {publishType && publishType.map(item => (
                                    <Select.Option key={item.id} value={item.id} title={item.title}>
                                        {item.title}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Row style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                            <Form.Item label="Тип договора" name="contractType" style={{width: '48%'}} rules={[{ required: true, message: 'Выберите тип договора' }]}>
                                <Select placeholder="Тип договора">
                                    {contractType && contractType.map(item => (
                                        <Select.Option key={item.id} value={item.id} title={item.title}>
                                            {item.title}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item label="Количество мест" name="seatsCount" style={{width: '48%'}} rules={[{ required: true, message: 'Введите количество мест' }]}>
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </Row>
                        <Form.Item label="Реквизиты" name="requisites" rules={[{ required: true, message: 'Введите реквизиты' }]}>
                            <Input.TextArea placeholder="Введите реквизиты события" />
                        </Form.Item>
                        <Form.Item label="Комментарии" name="comments" rules={[{ required: true, message: 'Введите комментарии' }]}>
                            <Input.TextArea placeholder="Введите комментарии к событию" />
                        </Form.Item>
                        <Form.Item label="Тип события" name="type">
                            <Select placeholder="Тип события">
                                {typeEvent && typeEvent.map(item => (
                                    <Select.Option key={item.id} value={item.id} title={item.title}>
                                        {item.title}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Checkbox name="technicalSupportRequired">Требуется ли техническое сопровождение</Checkbox>
                        </Form.Item>
                        <Form.Item name="techSupportNeeds">
                            <Input.TextArea placeholder="Что требуется от технической поддержки" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default ModalEventEdit;
