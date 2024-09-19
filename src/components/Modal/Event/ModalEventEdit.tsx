import React, { useEffect, useState } from 'react';
import {Modal, Form, Input, Button, Avatar, Select, InputNumber, Checkbox, Row, Col} from 'antd';
import { useModalContext } from '../../../contexts/ModalContext';
import { AppEvent } from "../../../types/event";
import dayjs, { Dayjs } from "dayjs";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {getBuilds, getFields, getRooms, getUsers, updateEvent} from "../../../services/bx";
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

    console.log(roomsData);

    const useUpdateEventMutation = () => {
        const queryClient = useQueryClient();

        return useMutation(updateEvent, {
            onSuccess: () => {
                // Обновляем кеш событий или других данных после успешного обновления
                queryClient.invalidateQueries(['events']);
            },
            onError: (error) => {
                console.error('Ошибка при обновлении события:', error);
            },
        });
    };
    const { mutate: updateEventMutate, isLoading: isUpdating } = useUpdateEventMutation();

    const handleSaveEvent = () => {
        form.validateFields().then(values => {
            const updatedEvent: AppEvent = {
                ...event,
                ...values,
                dateFrom: dates[0],
                dateTo: dates[1],
                responsibleStaffList: selectedIds,
                contractType: contract_,
                rooms,
                actionPlaces: build,
                seatsCount,
                published: publish,
                ages: age,
                techSupportNeeds,
                technicalSupportRequired,
            };

            // Вызываем мутацию для обновления события
            updateEventMutate(updatedEvent, {
                onSuccess: () => {
                    closeModal();
                },
            });
        }).catch(info => {
            console.log('Ошибка при валидации:', info);
        });
    };

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
                <Button key="submit" type="primary"  onClick={handleSaveEvent}>
                    Сохранить
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical" initialValues={event} variant={'filled'}>
                <Row gutter={24} >
                    <Col span={12} style={{justifyContent: 'space-between'}}>
                        <Form.Item  label="Название мероприятия"   rules={[{ required: true, message: 'Введите заголовок' }]}>
                            <Input placeholder="Введите заголовок события" value={title} onChange={(e) => setTitle(e.target.value)} />
                        </Form.Item>
                        <Form.Item  label="Время проведения" rules={[{ required: true, message: 'Введите реквизиты' }]}>
                        <RangePicker
                            placeholder={['Начало мероприятия', 'Окончание мероприятия']}
                            onChange={handleDateChange}
                            showTime
                            style={{ width: '100%' }}
                            variant={'filled'}
                            value={dates || [null, null]} // Устанавливаем значение для контролируемого компонента
                        />
                        </Form.Item>
                <Row style={{justifyContent: 'space-between'}}>
                    <Form.Item  label="Ответственные сотрудники" rules={[{ required: true, message: 'Введите реквизиты' }]} style={{ width: '60%' }}>
                    <Select
                        placeholder="Выберите сотрудников"

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
                    </Form.Item>
                    <Form.Item  label="Возрастной рейтинг" rules={[{ required: true, message: 'Введите реквизиты' }]} style={{ width: '35%' }}>
                    <Select
                        mode={'multiple'}
                        placeholder="Возрастной рейтинг"

                        value={age} // Отображаем выбранный ID
                        onChange={(e) => setAge(e)} // Обрабатываем изменения и сохраняем ID

                    >
                        {ageType && ageType.map(item => (
                            <Select.Option key={item.id} value={item.id} title={item.title}>
                                {item.title}
                            </Select.Option>
                        ))}
                    </Select>
                    </Form.Item>

                </Row>
                        <Row style={{justifyContent: 'space-between', alignItems: 'center', margin: '10px 0'}}>



                            <Form.Item  label="Используемый зал" rules={[{ required: true, message: 'Введите реквизиты' }]} style={{ width: '48%' }}>
                        <Select
                            placeholder="Выберите зал"

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
                                    <Avatar style={{  backgroundColor: employee.color, height: 17, width: 17, marginRight: 5, marginBottom: 4}} />
                                    {employee.title}
                                </Select.Option>
                            ))}
                        </Select>
                            </Form.Item>
                            <Form.Item  label="Используемый филиал" rules={[{ required: true, message: 'Введите реквизиты' }]} style={{ width: '48%' }}>
                        <Select
                            placeholder="Выберите филиал"

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
                            </Form.Item>

                        </Row>






                        <Form.Item  label="Описание">
                            <Input.TextArea variant={'filled'} placeholder="Введите описание события" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>







                        <Form.Item  label="Публикации для площадок"   rules={[{ required: true, message: 'Введите заголовок' }]}>
                        <Select
                            mode={'multiple'}
                            placeholder="Площадки для публикация"
                            style={{ width: '100%' }}
                            value={publish} // Отображаем выбранный ID
                            onChange={(e) => setPublish(e)} // Обрабатываем изменения и сохраняем ID
                        >
                            {publishType && publishType.map(item => (
                                <Select.Option key={item.id} value={item.id} title={item.title}>
                                    {item.title}
                                </Select.Option>
                            ))}
                        </Select>
                        </Form.Item>
                        <Row style={{  alignItems: 'center', justifyContent: 'space-between' }}>
                        <Form.Item  label="Тип договора"   rules={[{ required: true, message: 'Введите заголовок' }]} style={{ width: '60%' }}>
                        <Select
                            placeholder="Тип договора"

                            value={contract_} // Отображаем выбранный ID
                            onChange={handleChangeContract} // Обрабатываем изменения и сохраняем ID
                        >
                            {contract && contract.map(item => (
                                <Select.Option key={item.id} value={item.id} title={item.title}>
                                    {item.title}
                                </Select.Option>
                            ))}
                        </Select>
                        </Form.Item>
                            <Form.Item  label="Количество мест"   rules={[{ required: true, message: 'Введите заголовок' }]} style={{ width: '30%' }}>
                                <InputNumber style={{ width: '100%'}} value={seatsCount} onChange={(e) => {
                                    if (e) setSeatsCount(e);
                                }}/>
                            </Form.Item>
                        </Row>
                        <Form.Item label="Реквизиты"   rules={[{ required: true, message: 'Введите реквизиты' }]}>
                            <Input.TextArea placeholder="Введите реквизиты события" value={requisites} onChange={(e) => setRequisites(e.target.value)} />
                        </Form.Item>
                <Form.Item  label="Комментарии" rules={[{ required: true, message: 'Введите реквизиты' }]}>
                    <Input.TextArea placeholder="Введите реквизиты события" value={comments} onChange={(e) => setComments(e.target.value)} />
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


                    <Checkbox title={"Требуется ли техническое сопровождение"} value={technicalSupportRequired} onChange={(e) => setTechnicalSupportRequired(!technicalSupportRequired)} style={{ margin: '10px 0'}}>{"Требуется ли техническое сопровождение"} </Checkbox>

                {
                    technicalSupportRequired && <Form.Item label="Что требуется от технической поддержки" rules={[{ required: true, message: 'Что требуется от технической поддержки' }]}>
                        <Input.TextArea placeholder="Что требуется от технической поддержки" value={techSupportNeeds} onChange={(e) => setTechSupportNeeds(e.target.value)} />
                    </Form.Item>
                }
                    </Col>
                </Row>
            </Form>

        </Modal>
    );
};

export default ModalEventEdit;
