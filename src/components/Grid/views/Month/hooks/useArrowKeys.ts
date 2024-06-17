import { useEffect } from 'react';

type Direction = 'left' | 'right' | 'up' | 'down';

const useArrowKeys = (onArrowPress: (direction: Direction) => void) => {
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			switch (event.key) {
				case 'ArrowLeft':
					onArrowPress('left');
					break;
				case 'ArrowRight':
					onArrowPress('right');
					break;
				case 'ArrowUp':
					onArrowPress('up');
					break;
				case 'ArrowDown':
					onArrowPress('down');
					break;
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [onArrowPress]);
};

export default useArrowKeys;
