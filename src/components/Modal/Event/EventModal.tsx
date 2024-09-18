import React from 'react';
import { Modal } from 'antd';

import ModalEventCreate from './ModalEventCreate';
import ModalEventEdit from './ModalEventEdit';
import ModalEventRead from './ModalEventRead';
import {useModalContext} from "../../../contexts/ModalContext";

const EventModal = () => {
    const { event, isEditMode, isVisible, closeModal } = useModalContext();

    if (!isVisible) return null; // Модальное окно не рендерится, если оно не должно быть открыто

    const getModalContent = () => {
        if (event === null) {
            return <ModalEventCreate />; // Открываем модалку для создания события, если event == null
        }
        return isEditMode ? <ModalEventEdit /> : <ModalEventRead />;
    };

    return (
        <Modal
            visible={isVisible}
            onCancel={closeModal}  // Закрытие модального окна
            footer={null}         // Оставляем кастомные кнопки внутри каждого компонента (Create/Edit/Read)
        >
            {getModalContent()}
        </Modal>
    );
};

export default EventModal;
