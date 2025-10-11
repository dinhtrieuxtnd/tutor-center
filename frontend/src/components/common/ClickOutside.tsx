"use client";

import { useRef, useEffect, type ReactNode } from "react";

interface ClickOutsideProps {
    children: ReactNode;
    onClickOutside: () => void;
    className?: string;
    ignoreSelectors?: string[]; // CSS selectors để bỏ qua
    ignoreRefs?: React.RefObject<HTMLElement>[]; // Refs để bỏ qua
}

export const ClickOutside = ({
    children,
    onClickOutside,
    className = "",
    ignoreSelectors = [],
    ignoreRefs = [],
}: ClickOutsideProps) => {
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            // Kiểm tra xem click có nằm trong wrapper không
            if (wrapperRef.current && wrapperRef.current.contains(target)) {
                return;
            }

            // Kiểm tra các refs được bỏ qua
            const isClickInIgnoredRef = ignoreRefs.some(ref => 
                ref.current && ref.current.contains(target)
            );

            if (isClickInIgnoredRef) {
                return;
            }

            // Kiểm tra các selectors được bỏ qua
            const isClickInIgnoredSelector = ignoreSelectors.some(selector => {
                try {
                    const elements = document.querySelectorAll(selector);
                    return Array.from(elements).some(element => 
                        element.contains(target)
                    );
                } catch (error) {
                    console.warn(`Invalid selector: ${selector}`);
                    return false;
                }
            });

            if (isClickInIgnoredSelector) {
                return;
            }

            // Nếu không thuộc các trường hợp bỏ qua, gọi onClickOutside
            onClickOutside();
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [onClickOutside, ignoreSelectors, ignoreRefs]);

    return (
        <div ref={wrapperRef} className={className}>
            {children}
        </div>
    );
}
