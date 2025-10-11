"use client";

import { InputHTMLAttributes, useState } from "react";
import { Calendar } from "lucide-react";
import { DatePicker } from "../calender";
import { ClickOutside } from "../common";

interface DateInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: boolean;
    required?: boolean;
    id?: string;
}

export const DateInput = ({
    label,
    error,
    required = false,
    className = "",
    value,
    onChange,
    id,
    ...props
}: DateInputProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const hasValue = value !== "" && value !== undefined;

    const inputId = id || label.replace(/\s+/g, "_").toLowerCase();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let input = e.target.value.replace(/\D/g, "");
        let formatted = "";

        if (input.length <= 2) {
            formatted = input;
        } else if (input.length <= 4) {
            formatted = `${input.slice(0, 2)}/${input.slice(2)}`;
        } else {
            formatted = `${input.slice(0, 2)}/${input.slice(2, 4)}/${input.slice(
                4,
                8
            )}`;
        }

        if (input.length > 8) return;

        if (onChange) {
            const syntheticEvent = {
                ...e,
                target: { ...e.target, value: formatted },
            };
            // @ts-ignore
            onChange(syntheticEvent);
        }
    };

    return (
        <div className="relative w-full">
            {/* Wrapper riêng cho input để popup định vị */}
            <div className="relative w-full">
                <input
                    {...props}
                    type="text"
                    id={inputId}
                    value={value}
                    onChange={handleInputChange}
                    required={required}
                    placeholder="DD/MM/YYYY"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`w-full border-[#C4C4C4] text-sm rounded-xl border-2 px-4 py-3 md:px-6 md:py-4 outline-none transition
            focus:border-primary
            ${error ? "border-red-500" : ""}
            ${className}
          `}
                />

                <label
                    htmlFor={inputId}
                    className={`absolute left-4 md:left-6 px-1 px-1 bg-white cursor-text
            font-normal font-open-sans
            transition-all duration-200 z-10 text-black
            ${isFocused || hasValue ? "-top-2.5 text-sm" : "top-3 md:top-4 text-base"}
          `}
                >
                    {label} {required && <span className="text-red-500">*</span>}
                </label>

                <span
                    onClick={() => setIsOpen((p) => !p)}
                    className="absolute inset-y-0 right-5 flex items-center cursor-pointer 
             text-black transform transition-transform duration-200 ease-in-out
             hover:scale-110 hover:text-primary"
                >
                    <Calendar className="h-5 w-5" />
                </span>


            </div>
            {/* Popup DatePicker (absolute theo input wrapper) */}
            {isOpen && (
                <ClickOutside onClickOutside={() => setIsOpen(false)} className="absolute -top-[430px] right-80 mb-2 z-20">
                    <DatePicker
                        value={value as string}
                        onChange={(val) => {
                            if (onChange) {
                                const syntheticEvent = { target: { value: val } };
                                // @ts-ignore
                                onChange(syntheticEvent);
                            }
                            setIsOpen(false);
                        }}
                    />
                </ClickOutside>
            )}
        </div>
    );
};
