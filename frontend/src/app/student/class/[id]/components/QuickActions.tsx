import { MessageSquare, Share2, Settings } from 'lucide-react';

export function QuickActions() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-base font-bold text-gray-900 mb-4 font-poppins">
        Thao tác nhanh
      </h3>
      <div className="space-y-2">
        <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left font-open-sans">
          <MessageSquare className="w-5 h-5 text-gray-600" />
          <span className="text-gray-700">Nhắn tin nhóm</span>
        </button>
        <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left font-open-sans">
          <Share2 className="w-5 h-5 text-gray-600" />
          <span className="text-gray-700">Chia sẻ lớp học</span>
        </button>
        <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left font-open-sans">
          <Settings className="w-5 h-5 text-gray-600" />
          <span className="text-gray-700">Cài đặt</span>
        </button>
      </div>
    </div>
  );
}
