import { useEffect, useState } from "react";

/**
 * Hook debounce giá trị
 * @param value - giá trị cần debounce
 * @param delay - thời gian delay (ms)
 * @returns debouncedValue - giá trị sau debounce
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}
