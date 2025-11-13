'use client';

import { LucideIcon } from 'lucide-react';

interface ClassStatsCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  valueColor?: string;
}

export function ClassStatsCard({
  label,
  value,
  icon: Icon,
  iconBgColor,
  iconColor,
  valueColor = 'text-gray-900'
}: ClassStatsCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1 font-open-sans">{label}</p>
          <p className={`text-2xl font-bold font-poppins ${valueColor}`}>
            {value}
          </p>
        </div>
        <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}
