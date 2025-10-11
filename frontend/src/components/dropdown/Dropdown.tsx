"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ClickOutside } from "../common";

interface Option<T = any> {
    title: string;
    value: T;
}

interface DropdownProps<T = any> {
    label: string;
    value: T | null;                // ✅ nhận value từ ngoài
    options: Option<T>[];
    onSelect?: (value: T) => void;
    required?: boolean;
}

export const Dropdown = <T,>({
    label = "Menu",
    options,
    value,
    onSelect,
    required = false,
}: DropdownProps<T>) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (val: T) => {
        setIsOpen(false);
        if (onSelect) onSelect(val); // ✅ gọi callback cho parent quản lý value
    };

    const hasValue = value !== null && value !== undefined;

    return (
        <ClickOutside className="w-full flex" onClickOutside={() => setIsOpen(false)}>
            <div className="relative w-full text-left font-open-sans">
                {/* Label */}
                <div className="relative w-full group">
                    <label
                        onClick={() => setIsOpen((prev) => !prev)}
                        className={`absolute left-4 md:left-6 px-1 px-1 bg-white cursor-pointer font-normal transition-all duration-200 z-10
              ${hasValue ? "-top-2.5 text-sm" : "top-3 md:top-4 text-base"}
            `}
                    >
                        {label} {required && <span className="text-red-500">*</span>}
                    </label>

                    <button
                        type="button"
                        onClick={() => setIsOpen((prev) => !prev)}
                        className="w-full cursor-pointer px-4 py-3 md:px-6 md:py-4 rounded-xl border-2 border-[#C4C4C4] 
              hover:border-primary group-hover:border-primary 
              outline-none inline-flex justify-between items-center"
                    >
                        <span className={hasValue ? "text-black" : "text-gray-400"}>
                            {hasValue
                                ? options.find((o) => o.value === value)?.title
                                : ""}
                        </span>
                        <ChevronDown
                            className={`ml-2 h-5 w-5 text-gray-600 transform transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"
                                }`}
                        />
                    </button>
                </div>

                {/* Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
                            animate={{ opacity: 1, y: 0, scaleY: 1 }}
                            exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute mt-2 top-full rounded-xl left-0 w-full bg-white 
                border-2 border-[#C4C4C4] shadow-lg z-20 origin-top 
                max-h-60 overflow-y-auto"
                        >
                            <ul>
                                {options.map((option) => {
                                    const isSelected = value === option.value;
                                    return (
                                        <li key={String(option.value)}>
                                            <button
                                                type="button"
                                                onClick={() => handleSelect(option.value)}
                                                className={`rounded-xl cursor-pointer w-full text-left block px-4 py-3 md:px-6 md:py-4
                          ${isSelected
                                                        ? "bg-gray-100 text-gray-700"
                                                        : "text-gray-700 hover:bg-gray-100"
                                                    }
                        `}
                                            >
                                                {option.title}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ClickOutside>
    );
};
