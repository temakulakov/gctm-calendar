import React from 'react';
import { Modal, Descriptions, Button } from 'antd';
import { useModalContext } from '../../../contexts/ModalContext';

const ModalEventRead = () => {
    const { event, closeModal } = useModalContext();

    if (!event) return null;

    return (
        <Modal
            title="Просмотр события"
            visible={true}
            onCancel={closeModal}
            footer={[
                <Button key="close" onClick={closeModal}>
                    Закрыть
                </Button>,
            ]}
        >
            <Descriptions bordered>
                <Descriptions.Item label="Заголовок">{event.title}</Descriptions.Item>
                <Descriptions.Item label="Описание">{event.description}</Descriptions.Item>
                {/* Другие поля для просмотра */}
            </Descriptions>
        </Modal>
    );
};

export default ModalEventRead;
