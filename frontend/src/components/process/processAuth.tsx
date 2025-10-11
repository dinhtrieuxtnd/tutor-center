"use client";

import React from "react";
import { Check } from "lucide-react";

interface ProcessAuthProps {
  currentStep?: number; // 1 | 2 | 3
  success?: boolean;
  percent?: number; // Cho phép truyền % trực tiếp
}

const steps = [
  { id: 1, label: "Cá nhân" },
  { id: 2, label: "Học vấn" },
  { id: 3, label: "Đăng nhập" },
  { id: 4, label: "Hoàn thành" },
];

export const ProcessAuth: React.FC<ProcessAuthProps> = ({
  currentStep = 1,
  success = false,
  percent,
}) => {
  // Nếu có percent thì ưu tiên, nếu không thì tính theo step
  const progressPercent =
    percent !== undefined
      ? Math.min(Math.max(percent, 0), 100) // Giới hạn 0–100
      : success 
        ? 100 // Nếu success thì 100%
        : ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-6">
      {/* Thanh nền */}
      <div className="absolute top-1/2 left-0 right-0 h-2 bg-secondary -translate-y-1/2 rounded-full" />

      {/* Thanh tiến trình */}
      <div
        className="absolute top-1/2 left-0 h-2 bg-primary -translate-y-1/2 rounded-full transition-all duration-500"
        style={{ width: `${progressPercent}%` }}
      />

      {/* Các bước */}
      <div className="flex justify-between relative z-10">
        {steps.map((step, index) => {
          const stepPercent = (index / (steps.length - 1)) * 100;
          
          // Logic mới: 
          // - Bước 4 (Hoàn thành) chỉ completed khi success = true
          // - Các bước khác completed khi đã qua step đó
          const isCompleted = step.id === 4 
            ? success 
            : success || currentStep > step.id;
          
          // Bước 4 chỉ active khi success = true
          const isActive = step.id === 4 
            ? success 
            : currentStep >= step.id;

          return (
            <div key={step.id} className="relative flex flex-col items-center">
              {/* Circle */}
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full border-2 font-bold transition-all duration-300
                  ${
                    isActive
                      ? "bg-primary border-primary text-white animate-bounce-scale"
                      : "bg-secondary border-secondary text-white"
                  }
                `}
              >
                {isCompleted ? (
                  <Check size={24} strokeWidth={3} />
                ) : (
                  step.id
                )}
              </div>

              {/* Label */}
              <span
                className={`absolute top-full w-20 text-center mt-1 text-sm transition-all duration-300
                  ${
                    isActive
                      ? "text-black font-semibold"
                      : "text-gray-600 font-bold"
                  }
                `}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
