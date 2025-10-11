"use client";

import { InputHTMLAttributes } from "react";
import { Check } from "lucide-react";

interface AuthCheckboxProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    label?: string;
}

export const AuthCheckbox = ({
    label,
    checked,
    onChange,
    className = "",
    ...props
}: AuthCheckboxProps) => {
    return (
        <label className="flex items-center gap-2 cursor-pointer select-none">
            {/* Hidden real checkbox */}
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                {...props}
                className="hidden"
            />

            {/* Custom box */}
            <span
                className={`relative w-5 h-5 flex items-center justify-center border-2 rounded-md transition
          ${checked ? "bg-primary border-primary" : "border-gray-300"}
          ${className}
        `}
            >
                {checked && <Check className="w-4 h-4 text-white" />}
            </span>

            {label && (
                <span className="text-sm text-gray-700 font-open-sans">{label}</span>
            )}
        </label>
    );
};
