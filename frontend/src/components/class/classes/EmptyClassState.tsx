'use client';

import { BookOpen } from 'lucide-react';

interface EmptyClassStateProps {
  searchQuery: string;
  onJoinClass: () => void;
}

export function EmptyClassState({ searchQuery, onJoinClass }: EmptyClassStateProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <BookOpen className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2 font-poppins">
        Không tìm thấy lớp học
      </h3>
      <p className="text-gray-600 mb-6 font-open-sans">
        {searchQuery ? 'Thử tìm kiếm với từ khóa khác' : 'Bạn chưa tham gia lớp học nào'}
      </p>
      <button
        onClick={onJoinClass}
        className="px-6 py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg hover:shadow-lg transition-all font-open-sans"
      >
        Tìm lớp học ngay
      </button>
    </div>
  );
}
