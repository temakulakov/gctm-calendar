import { useEffect } from 'react';

const useKeyPress = (targetKeys: string[], action: () => void) => {
	useEffect(() => {
		const keyHandler = (event: KeyboardEvent) => {
			if (targetKeys.includes(event.key.toLowerCase())) {
				action();
			}
		};

		window.addEventListener('keydown', keyHandler);
		return () => {
			window.removeEventListener('keydown', keyHandler);
		};
	}, [targetKeys, action]);
};

export default useKeyPress;
