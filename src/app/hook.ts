// app/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store';

import { useEffect } from 'react';

export const useScroll = (
	ref: React.RefObject<HTMLElement>,
	pixels: number
) => {
	useEffect(() => {
		if (ref.current) {
			ref.current.scrollTop += pixels;
		}
	}, [ref, pixels]);
};

// Используйте вместо обычного useDispatch и useSelector
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
