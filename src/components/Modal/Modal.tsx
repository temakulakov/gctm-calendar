import React, { useRef, useState } from 'react';
import { IEvent } from '../../types/type';
import styles from './Modal.module.scss';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	event: IEvent | null;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, event }) => {
	const modalRef = useRef<HTMLDivElement>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [position, setPosition] = useState({ top: 50, left: 50 });
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

	const handleMouseDown = (e: React.MouseEvent) => {
		if (modalRef.current && e.target === modalRef.current) {
			setIsDragging(true);
			setDragStart({
				x: e.clientX - position.left,
				y: e.clientY - position.top,
			});
		}
	};

	const handleMouseMove = (e: MouseEvent) => {
		if (isDragging) {
			setPosition({
				top: e.clientY - dragStart.y,
				left: e.clientX - dragStart.x,
			});
		}
	};

	const handleMouseUp = () => {
		setIsDragging(false);
	};

	React.useEffect(() => {
		if (isDragging) {
			document.addEventListener('mousemove', handleMouseMove);
			document.addEventListener('mouseup', handleMouseUp);
		} else {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		}
	}, [isDragging]);

	if (!isOpen || !event) return null;

	return (
		<div className={styles.overlay}>
			<div
				ref={modalRef}
				className={styles.modal}
				style={{ top: position.top, left: position.left }}
				onMouseDown={handleMouseDown}
			>
				<button className={styles.closeButton} onClick={onClose}>
					&times;
				</button>
				<div className={styles.content}>
					<h2>{event.title}</h2>
					<p>Stage ID: {event.stageId}</p>
					<p>Opportunity: {event.opportunity}</p>
					<p>Responsible Staff: {event.responsibleStaffList.join(', ')}</p>
					<p>From: {event.dateFrom.format('DD/MM/YYYY HH:mm')}</p>
					<p>To: {event.dateTo.format('DD/MM/YYYY HH:mm')}</p>
					<p>Type: {event.type}</p>
					<p>Duration: {event.duration}</p>
					<p>Department: {event.department}</p>
					<p>Rooms: {event.rooms}</p>
					<p>Seats Count: {event.seatsCount}</p>
					<p>Contract Type: {event.contractType}</p>
					<p>Price: {event.price}</p>
					<p>Requisites: {event.requisites}</p>
					<p>Action Places: {event.actionPlaces.join(', ')}</p>
					<p>Technical Support Required: {event.technicalSupportRequired}</p>
					<p>Comments: {event.comments}</p>
					<p>Event Details: {event.eventDetails}</p>
					<p>Contact Full Name: {event.contactFullName}</p>
					<p>Assigned By ID: {event.assignedById}</p>
					<p>Created By: {event.createdBy}</p>
					<p>Description: {event.description}</p>
					<p>Tech Support Needs: {event.techSupportNeeds}</p>
				</div>
			</div>
		</div>
	);
};

export default Modal;
