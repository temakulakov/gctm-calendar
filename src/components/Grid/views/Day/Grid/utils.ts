import { useRef, useEffect } from 'react';

export const useHorizontalScroll = (scrollSpeed = 0.5) => {
    const scrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleWheel = (event: WheelEvent) => {
            if (scrollRef.current) {
                event.preventDefault();
                scrollRef.current.scrollTo({
                    left: scrollRef.current.scrollLeft + event.deltaY * scrollSpeed, // уменьшаем шаг скролла
                    behavior: 'smooth', // плавная прокрутка
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
    }, [scrollSpeed]);

    return scrollRef;
};
