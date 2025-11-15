"use client";

import { InputHTMLAttributes, useState, ReactNode } from "react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: boolean;
  rightIcon?: ReactNode;
}

export const AuthInput = ({
  label,
  error,
  className = "",
  value,
  onChange,
  rightIcon,
  required = false,
  ...props
}: AuthInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const hasValue = value !== "" && value !== undefined;
  const inputId = props.name || label;

  return (
    <div className="relative w-full">
      <input
        {...props}
        id={inputId}
        value={value}
        required={required}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={props.placeholder}
        className={`w-full border-[#C4C4C4] text-sm rounded-xl border-2 px-4 py-3 md:px-6 md:py-4 outline-none transition
          focus:border-primary
          placeholder:font-semibold placeholder:text-gray-500
          text-gray-900 font-medium
          ${error ? "border-red-500" : ""}
          ${className}
          ${rightIcon ? "pr-12" : ""}
        `}
      />

      <label
        htmlFor={inputId}
        className={`absolute left-4 md:left-6 px-1 bg-white cursor-text
          font-semibold font-open-sans
          transition-all duration-200 z-10 text-gray-500
          ${isFocused || hasValue ? "-top-2.5 text-sm" : "top-3 md:top-4 text-base"}
        `}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {rightIcon && (
        <span className="absolute inset-y-0 right-5 flex items-center cursor-pointer text-black">
          {rightIcon}
        </span>
      )}

    </div>
  );
};
