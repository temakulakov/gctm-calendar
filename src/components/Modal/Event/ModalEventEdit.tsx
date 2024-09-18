import React, { useEffect, useState } from 'react';
import {Modal, Form, Input, Button, Avatar, Select, InputNumber, Checkbox, Row, Col} from 'antd';
import { useModalContext } from '../../../contexts/ModalContext';
import { AppEvent } from "../../../types/event";
import dayjs, { Dayjs } from "dayjs";
import { useQuery } from "@tanstack/react-query";
import {getBuilds, getFields, getRooms, getUsers} from "../../../services/bx";
import { DatePicker } from 'antd';
import { EventType } from "../../../types/type";
import {AppRoom} from "../../../types/Room";

const { RangePicker } = DatePicker;

const ModalEventEdit = () => {
    const { event, closeModal } = useModalContext();
    const [form] = Form.useForm();
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [dates, setDates] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [contract_, setContracts] = useState<number | null>(null); // Теперь может быть null
    const [ type, setType ] = useState<number>(0);
    const [ publish, setPublish ] = useState<number[]>([]);
    const [ requisites, setRequisites ] = useState<string>('');
    const [seatsCount, setSeatsCount] = useState<number>(0);
    const [ age, setAge ] = useState<number[]>([]);
    const [ comments, setComments ] = useState<string>('')
    const [technicalSupportRequired, setTechnicalSupportRequired] = useState<boolean>(false);
    const [techSupportNeeds, setTechSupportNeeds] = useState<string>();

    const [ rooms, setRooms] = useState<number>(0);
    const [ build, setBuild] = useState<number>(0);

    const [typeEvent, setTypeEvent] = useState<EventType[]>();
    const [departments, setDepartments] = useState<EventType[]>();
    const [roomsType, setRoomsType] = useState<AppRoom[]>([]);
    const [buildType, setBuildType] = useState<AppBuild[]>([]);

    const [contract, setContract] = useState<EventType[]>();
    const [publishType, setPublishType] = useState<EventType[]>();
    const [ageType, setAgeType] = useState<EventType[]>();

    const { data: roomsData, isLoading: isLoadingRoomsData } = useQuery({queryKey: ['rooms'], queryFn: () => getRooms()});
    const { data: buildsData, isLoading: isLoadingBuildsData } = useQuery({queryKey: ['builds'], queryFn: () => getBuilds()});

    console.log(roomsData)

    useEffect(() => {
        if (event) {
            setSelectedIds(event.responsibleStaffList);
            setDates([event.dateFrom, event.dateTo]);
            setTitle(event.title);
            setDescription(event.description);
            setContracts(event.contractType); // Сохраняем ID выбранного типа договора
            setType(event.type);
            setRooms(event.rooms);
            setBuild(event.actionPlaces);
            setRequisites(event.requisites);
            setSeatsCount(event.seatsCount);
            setAge(event.ages);
            setPublish(event.published);
            setComments(event.comments);
            setTechSupportNeeds(event.techSupportNeeds);


            console.log(event.requisites)
            console.log(requisites)
            console.log(event)

        }
    }, [event]);

    useEffect(() => {
        if (roomsData) setRoomsType(roomsData)
    }, [roomsData]);

    useEffect(() => {
        if (buildsData) setBuildType(buildsData)
        console.log(roomsData)
    }, [buildsData]);

    const { data: users } = useQuery({ queryKey: ['users'], queryFn: getUsers });
    const { data: userFields, error } = useQuery({ queryKey: ['userFields'], queryFn: getFields });

    useEffect(() => {
        if (!error && userFields) {
            userFields.forEach(element => {
                if (element.id === 129 && element.list) setTypeEvent(element.list);
                if (element.id === 131 && element.list) setDepartments(element.list);
                // if (element.id === 132 && element.list) setRooms(element.list);
                if (element.id === 133 && element.list) setContract(element.list); // Устанавливаем типы контрактов
                if (element.id === 134 && element.list) setPublishType(element.list);
                if (element.id === 144 && element.list) setAgeType(element.list);
            });
        }
    }, [userFields]);



    const handleSave = () => {
        form.validateFields().then(values => {
            console.log('Сохранение изменений...', { ...event, ...values });
            closeModal();
        }).catch(info => {
            console.log('Ошибка при валидации:', info);
        });
    };

    const handleChangeContract = (value: number) => {
        setContracts(value); // Обновляем ID выбранного контракта
    };

    const handleChangeType = (value: number) => {
        setType(value); // Обновляем ID выбранного контракта
    };

    const handleDateChange = (dates: [Dayjs | null, Dayjs | null] | null, dateStrings: [string, string]) => {
        if (dates) {
            setDates(dates); // Устанавливаем выбранные даты
        } else {
            setDates([null, null]); // Если значение null, сбрасываем диапазон
        }
    };

    useEffect(() => {
        console.log(technicalSupportRequired)
    }, [technicalSupportRequired]);

    // Находим название контракта по его ID для отображения в Select
    const selectedContract = contract?.find(c => c.id === contract_);
    if (!event) return null;
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
                <Button key="submit" type="primary" onClick={handleSave}>
                    Сохранить
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical" initialValues={event} variant={'filled'}>
                <Row gutter={24} >
                    <Col span={12} style={{justifyContent: 'space-between'}}>
                        <Form.Item name="title" label="Название мероприятия"   rules={[{ required: true, message: 'Введите заголовок' }]}>
                            <Input placeholder="Введите заголовок события" value={title} onChange={(e) => setTitle(e.target.value)} />
                        </Form.Item>
                        {/*Время мероприятия*/}
                        <RangePicker
                            placeholder={['Начало мероприятия', 'Окончание мероприятия']}
                            onChange={handleDateChange}
                            showTime
                            variant={'filled'}
                            value={dates || [null, null]} // Устанавливаем значение для контролируемого компонента
                        />
                <Row style={{justifyContent: 'space-between', alignItems: 'center', margin: '10px 0'}}>
                    <Select
                        placeholder="Выберите сотрудников"
                        style={{ width: '70%' }}
                        value={selectedIds}
                        onChange={setSelectedIds} // Обрабатываем изменения
                        optionFilterProp="children"
                        showSearch
                        mode={'multiple'}
                        variant={'filled'}
                        filterOption={(input, option) =>
                            option?.props?.title?.toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        {users && users.map(employee => (
                            <Select.Option key={employee.id} value={employee.id} title={employee.name}>
                                {/*<Avatar src={employee.imageUrl} size="small" style={{ marginRight: 8 }} />*/}
                                {employee.name}
                            </Select.Option>
                        ))}
                    </Select>
                    <Select
                        mode={'multiple'}
                        placeholder="Возрастной рейтинг"
                        style={{ width: '20%', height: 'fit-content' }}
                        value={age} // Отображаем выбранный ID
                        onChange={(e) => setAge(e)} // Обрабатываем изменения и сохраняем ID

                    >
                        {ageType && ageType.map(item => (
                            <Select.Option key={item.id} value={item.id} title={item.title}>
                                {item.title}
                            </Select.Option>
                        ))}
                    </Select>

                </Row>
                        <Row style={{justifyContent: 'space-between', alignItems: 'center', margin: '10px 0'}}>




                        <Select
                            placeholder="Выберите зал"
                            style={{ width: '48%' }}
                            value={rooms}
                            onChange={setRooms} // Обрабатываем изменения
                            optionFilterProp="children"
                            // showSearch

                            variant={'filled'}
                            filterOption={(input, option) =>
                                option?.props?.title?.toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {roomsType && roomsType.filter(el => el.section === build).map(employee => (
                                <Select.Option key={employee.id} value={employee.id} title={employee.title} >
                                    <Avatar style={{  backgroundColor: employee.color, height: 20, width: 20, marginRight: 5}} />
                                    {employee.title}
                                </Select.Option>
                            ))}
                        </Select>
                        <Select
                            placeholder="Выберите филиал"
                            style={{ width: '48%' }}
                            value={build}
                            onChange={setBuild} // Обрабатываем изменения
                            optionFilterProp="children"
                            showSearch
                            variant={'filled'}
                            filterOption={(input, option) =>
                                option?.props?.title?.toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {buildType && buildType.map(employee => (
                                <Select.Option key={employee.id} value={employee.id} title={employee.title} style={{display: 'flex', alignItems: 'center'}}>
                                    {employee.title}
                                </Select.Option>
                            ))}
                        </Select>

                        </Row>






                        <Form.Item name="description" label="Описание">
                            <Input.TextArea variant={'filled'} placeholder="Введите описание события" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>

                <InputNumber value={seatsCount} onChange={(e) => {
                    if (e) setSeatsCount(e);
                }}/>






                        <Select
                            mode={'multiple'}
                            placeholder="Площадки для публикация"
                            style={{ width: '50%' }}
                            value={publish} // Отображаем выбранный ID
                            onChange={(e) => setPublish(e)} // Обрабатываем изменения и сохраняем ID
                        >
                            {publishType && publishType.map(item => (
                                <Select.Option key={item.id} value={item.id} title={item.title}>
                                    {item.title}
                                </Select.Option>
                            ))}
                        </Select>
                        <Select
                            placeholder="Тип события"
                            style={{ width: '50%' }}
                            value={type} // Отображаем выбранный ID
                            onChange={handleChangeType} // Обрабатываем изменения и сохраняем ID
                        >
                            {typeEvent && typeEvent.map(item => (
                                <Select.Option key={item.id} value={item.id} title={item.title}>
                                    {item.title}
                                </Select.Option>
                            ))}
                        </Select>
                <Form.Item name="requisites" label="Реквизиты"   rules={[{ required: true, message: 'Введите реквизиты' }]}>
                    <Input placeholder="Введите реквизиты события" value={requisites} onChange={(e) => setRequisites(e.target.value)} />
                </Form.Item>
                <Form.Item name="comments" label="Комментарии" rules={[{ required: true, message: 'Введите реквизиты' }]}>
                    <Input placeholder="Введите реквизиты события" value={comments} onChange={(e) => setComments(e.target.value)} />
                </Form.Item>
                        <Select
                            placeholder="Тип события"
                            style={{ width: '50%' }}
                            value={type} // Отображаем выбранный ID
                            onChange={handleChangeType} // Обрабатываем изменения и сохраняем ID
                        >
                            {typeEvent && typeEvent.map(item => (
                                <Select.Option key={item.id} value={item.id} title={item.title}>
                                    {item.title}
                                </Select.Option>
                            ))}
                        </Select>
                        <Select
                            variant={'borderless'}
                            placeholder="Тип договора"
                            style={{ width: '50%' }}
                            value={contract_} // Отображаем выбранный ID
                            onChange={handleChangeContract} // Обрабатываем изменения и сохраняем ID
                        >
                            {contract && contract.map(item => (
                                <Select.Option key={item.id} value={item.id} title={item.title}>
                                    {item.title}
                                </Select.Option>
                            ))}
                        </Select>
                <Form.Item name="tp" label="Требуется ли техническое сопровождение" rules={[{ required: true, message: 'Требуется ли техническое сопровождение' }]}>
                    <Checkbox title={"Требуется ли техническое сопровождение"} value={technicalSupportRequired} onChange={(e) => setTechnicalSupportRequired(!technicalSupportRequired)} >{"Требуется ли техническое сопровождение"} </Checkbox>
                </Form.Item>

                {
                    technicalSupportRequired && <Form.Item name="technicalSupport" label="Комментарии" rules={[{ required: true, message: 'Что требуется от технической поддержки' }]}>
                        <Input placeholder="Что требуется от технической поддержки" value={techSupportNeeds} onChange={(e) => setTechSupportNeeds(e.target.value)} />
                    </Form.Item>
                }
                    </Col>
                </Row>
            </Form>

        </Modal>
    );
};

export default ModalEventEdit;
