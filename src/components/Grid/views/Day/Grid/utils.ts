import { useRef, useEffect } from 'react';

export const useHorizontalScroll = () => {
    const scrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleWheel = (event: WheelEvent) => {
            if (scrollRef.current) {
                event.preventDefault();
                scrollRef.current.scrollTo({
                    left: scrollRef.current.scrollLeft + event.deltaY,
                    behavior: 'smooth', // Плавная прокрутка
                });
            }
        };

        const ref = scrollRef.current;

        if (ref) {
            ref.addEventListener('wheel', handleWheel);
        }

        return () => {
            if (ref) {
                ref.removeEventListener('wheel', handleWheel);
            }
        };
    }, []);

    return scrollRef;
};
