import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppEvent } from '../types/event';
import dayjs, { Dayjs } from 'dayjs';

// Интерфейс контекста
interface ModalContextType {
    event: AppEvent | null;
    isEditMode: boolean;
    isVisible: boolean;
    creationDate: Dayjs | null; // Добавляем дату создания
    openModal: (event: AppEvent | Dayjs | null, isEditMode: boolean) => void;
    closeModal: () => void;
}

// Создаем контекст
const ModalContext = createContext<ModalContextType | undefined>(undefined);

// Хук для доступа к контексту
export const useModalContext = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModalContext должен использоваться внутри ModalProvider');
    }
    return context;
};

// Провайдер контекста
export const ModalProvider = ({ children }: { children: ReactNode }) => {
    const [event, setEvent] = useState<AppEvent | null>(null);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [creationDate, setCreationDate] = useState<Dayjs | null>(null);

    const openModal = (event: AppEvent | Dayjs | null, isEditMode: boolean) => {
        if (dayjs.isDayjs(event)) {
            setCreationDate(event); // Устанавливаем дату создания
            setEvent(null); // Очищаем событие, так как это создание нового
            setIsEditMode(false); // Отключаем режим редактирования
        } else {
            setEvent(event); // Устанавливаем событие для редактирования или просмотра
            setCreationDate(null); // Убираем дату создания
            setIsEditMode(isEditMode); // Устанавливаем режим редактирования
        }
        setIsVisible(true); // Открываем модальное окно
    };

    const closeModal = () => {
        setIsVisible(false); // Закрываем модальное окно
        setEvent(null);
        setIsEditMode(false);
        setCreationDate(null);
    };

    return (
        <ModalContext.Provider value={{ event, isEditMode, isVisible, creationDate, openModal, closeModal }}>
            {children}
        </ModalContext.Provider>
    );
};
