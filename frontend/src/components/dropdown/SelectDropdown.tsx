"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ClickOutside } from "../common";

export interface SelectOption<T = string | number> {
  label: string;
  value: T;
}

interface SelectDropdownProps<T = string | number> {
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  className?: string;
  placeholder?: string;
}

export function SelectDropdown<T extends string | number = string | number>({
  value,
  options,
  onChange,
  className = "",
  placeholder,
}: SelectDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (selectedValue: T) => {
    setIsOpen(false);
    onChange(selectedValue);
  };

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <ClickOutside className="relative inline-block" onClickOutside={() => setIsOpen(false)}>
      <div className="relative">
        {/* Button */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`
            appearance-none cursor-pointer
            px-4 py-2
            border border-gray-300 rounded-lg
            bg-white
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            font-open-sans text-gray-900
            hover:border-gray-400
            transition-colors
            inline-flex items-center justify-between
            min-w-[120px]
            ${className}
          `}
        >
          <span>
            {placeholder && !selectedOption ? placeholder : selectedOption?.label}
          </span>
          <ChevronDown
            className={`ml-2 w-4 h-4 text-gray-600 transform transition-transform duration-200 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute mt-2 top-full left-0 w-full bg-white 
                border border-gray-300 rounded-lg shadow-lg z-20 origin-top 
                max-h-60 overflow-y-auto"
            >
              <ul className="py-1">
                {options.map((option) => {
                  const isSelected = value === option.value;
                  return (
                    <li key={String(option.value)}>
                      <button
                        type="button"
                        onClick={() => handleSelect(option.value)}
                        className={`
                          cursor-pointer w-full text-left block px-4 py-2
                          font-open-sans
                          ${
                            isSelected
                              ? "bg-blue-50 text-blue-700"
                              : "text-gray-700 hover:bg-gray-100"
                          }
                        `}
                      >
                        {option.label}
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
}
