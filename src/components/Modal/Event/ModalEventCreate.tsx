import React from 'react';
import { Button, Form, Input, DatePicker } from 'antd';

import dayjs from 'dayjs';
import {useModalContext} from "../../../contexts/ModalContext";

const ModalEventCreate = () => {
    const { closeModal, creationDate } = useModalContext(); // Достаем дату создания из контекста
    const [form] = Form.useForm();

    const handleSave = () => {
        form.validateFields().then(values => {
            console.log('Создание нового события с данными:', values);
            closeModal(); // Закрытие модального окна после сохранения
        }).catch(info => {
            console.log('Ошибка при валидации:', info);
        });
    };

    return (
        <div>
            <Form form={form} layout="vertical" initialValues={{ dateFrom: creationDate || dayjs() }}> {/* Используем creationDate */}
                <Form.Item name="title" label="Заголовок" rules={[{ required: true, message: 'Введите заголовок' }]}>
                    <Input placeholder="Введите заголовок события" />
                </Form.Item>
                <Form.Item name="dateFrom" label="Дата начала" rules={[{ required: true, message: 'Выберите дату начала' }]}>
                    <DatePicker defaultValue={creationDate || dayjs()} /> {/* Используем creationDate */}
                </Form.Item>
                <Form.Item name="description" label="Описание">
                    <Input.TextArea placeholder="Введите описание события" />
                </Form.Item>
                <Button onClick={closeModal}>Отмена</Button>
                <Button type="primary" onClick={handleSave}>Создать</Button>
            </Form>
        </div>
    );
};

export default ModalEventCreate;
