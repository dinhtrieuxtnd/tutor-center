import { ClassroomResponse } from '@/services/classroomApi';

interface ProgressCardProps {
  classData: ClassroomResponse;
}

export function ProgressCard({ classData }: ProgressCardProps) {
  // Mock data cho các trường chưa có trong API
  const completedLessons = 12;
  const totalLessons = 36;
  const progress = 65;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-base font-bold text-gray-900 mb-4 font-poppins">
        Tiến độ học tập
      </h3>
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2 font-open-sans">
          <span className="text-gray-600">Đã hoàn thành</span>
          <span className="font-bold text-primary">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-primary to-blue-600 h-3 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-2xl font-bold text-primary font-poppins">
            {completedLessons}
          </p>
          <p className="text-xs text-gray-600 font-open-sans">Đã học</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-gray-900 font-poppins">
            {totalLessons}
          </p>
          <p className="text-xs text-gray-600 font-open-sans">Tổng bài</p>
        </div>
      </div>
    </div>
  );
}
