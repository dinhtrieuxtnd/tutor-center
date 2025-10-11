"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";
import { LoadingSpinner } from "../loading";

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: "primary" | "secondary" | "tertiary" | "outline" | "danger";
    fullWidth?: boolean;
    isLoading?: boolean;
}

export const AuthButton = ({
    children,
    type = 'button',
    isLoading = false,
    className = "",
    variant = "primary",
    fullWidth = true,
    disabled,
    ...props
}: AuthButtonProps) => {
    const baseStyle =
        "p-2.5 md:p-2.5 cursor-pointer text-base md:text-xl rounded-xl inline-flex justify-center items-center font-open-sans font-bold transition-colors";

    const variants: Record<NonNullable<AuthButtonProps["variant"]>, string> = {
        primary:
            "bg-primary text-white hover:text-primary hover:bg-secondary focus:ring-primary",
        secondary:
            "bg-secondary text-primary hover:bg-primary hover:text-white focus:ring-gray-400",
        tertiary:
            "bg-white border border-[#C4C4C4] hover:bg-[#E4E4E4] outline outline-2 outline-offset-[-2px] outline-[#C4C4C4]",
        outline:
            "border-2 border-primary text-primary hover:bg-primary/10 focus:ring-primary",
        danger:
            "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    };

    // Style cho trạng thái disabled của từng variant
    const disabledVariants: Record<NonNullable<AuthButtonProps["variant"]>, string> = {
        primary:
            "bg-gray-400 text-gray-200 cursor-not-allowed",
        secondary:
            "bg-gray-200 text-gray-400 cursor-not-allowed",
        tertiary:
            "bg-gray-100 border border-gray-300 text-gray-400 cursor-not-allowed",
        outline:
            "border-2 border-gray-300 text-gray-400 cursor-not-allowed",
        danger:
            "bg-red-300 text-red-100 cursor-not-allowed",
    };

    // helper: loại bỏ mọi class bắt đầu bằng "hover:" để giữ màu base mà không có hover
    const stripHoverClasses = (cls: string) =>
        cls
            .split(/\s+/)
            .filter((token) => !token.startsWith("hover:"))
            .join(" ");

    const appliedVariant = (isLoading || disabled) 
        ? disabledVariants[variant]
        : variants[variant];

    return (
        <button
            {...props}
            aria-busy={isLoading || undefined}
            disabled={isLoading || disabled}
            type={type}
            className={clsx(
                baseStyle,
                appliedVariant,        // luôn có màu của variant hoặc disabled variant
                fullWidth && "w-full",
                className
            )}
        >
            {isLoading ? (
                <LoadingSpinner size="md" className="text-current" />
            ) : (
                children
            )}
        </button>
    );
};
