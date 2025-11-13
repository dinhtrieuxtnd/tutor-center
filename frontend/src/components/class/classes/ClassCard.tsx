'use client';

import { useRouter } from 'next/navigation';
import { BookOpen, Users, Clock, CheckCircle, Hourglass } from 'lucide-react';

interface ClassItem {
  id: number;
  title: string;
  teacher: string;
  subject: string;
  students: number;
  totalLessons: number;
  completedLessons: number;
  nextLesson?: {
    date: string;
    time: string;
  };
  status: 'active' | 'pending' | 'completed';
  progress: number;
}

interface ClassCardProps {
  classItem: ClassItem;
  viewMode: 'grid' | 'list';
}

export function ClassCard({ classItem, viewMode }: ClassCardProps) {
  const router = useRouter();

  const getStatusInfo = (status: string) => {
    const statusMap = {
      active: {
        label: 'Đang học',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle,
        dotColor: 'bg-green-500'
      },
      pending: {
        label: 'Chờ duyệt',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: Hourglass,
        dotColor: 'bg-yellow-500'
      },
      completed: {
        label: 'Đã hoàn thành',
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: CheckCircle,
        dotColor: 'bg-gray-500'
      }
    };
    return statusMap[status as keyof typeof statusMap];
  };

  const statusInfo = getStatusInfo(classItem.status);
  const StatusIcon = statusInfo.icon;

  if (viewMode === 'list') {
    return (
      <div
        onClick={() => router.push(`/student/class/${classItem.id}`)}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-primary/50 transition-all cursor-pointer"
      >
        <div className="flex items-start gap-6">
          {/* Cover Image */}
          <div className="w-32 h-24 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex-shrink-0 flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1 font-poppins">
                  {classItem.title}
                </h3>
                <p className="text-sm text-gray-600 font-open-sans">
                  {classItem.teacher}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.color} flex items-center gap-1`}>
                <span className={`w-2 h-2 rounded-full ${statusInfo.dotColor}`}></span>
                {statusInfo.label}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-3">
              <div className="flex items-center gap-2 text-sm text-gray-600 font-open-sans">
                <Users className="w-4 h-4" />
                {classItem.students} học sinh
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 font-open-sans">
                <BookOpen className="w-4 h-4" />
                {classItem.totalLessons} bài học
              </div>
              {classItem.nextLesson && (
                <>
                  <div className="flex items-center gap-2 text-sm text-gray-600 font-open-sans">
                    <Clock className="w-4 h-4" />
                    {classItem.nextLesson.date}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-primary font-medium font-open-sans">
                    {classItem.nextLesson.time}
                  </div>
                </>
              )}
            </div>

            {classItem.status === 'active' && (
              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1 font-open-sans">
                  <span>Tiến độ</span>
                  <span className="font-medium">{classItem.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary to-blue-600 h-2 rounded-full"
                    style={{ width: `${classItem.progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div
      onClick={() => router.push(`/student/class/${classItem.id}`)}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:border-primary/50 transition-all cursor-pointer"
    >
      {/* Cover */}
      <div className="h-40 bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center relative">
        <BookOpen className="w-16 h-16 text-white" />
        <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${statusInfo.color} flex items-center gap-1`}>
          <span className={`w-2 h-2 rounded-full ${statusInfo.dotColor}`}></span>
          {statusInfo.label}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-base font-bold text-gray-900 mb-2 font-poppins line-clamp-2">
          {classItem.title}
        </h3>
        <p className="text-sm text-gray-600 mb-3 font-open-sans">
          {classItem.teacher}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 font-open-sans">
            <Users className="w-4 h-4" />
            {classItem.students} học sinh
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 font-open-sans">
            <BookOpen className="w-4 h-4" />
            {classItem.completedLessons}/{classItem.totalLessons} bài học
          </div>
          {classItem.nextLesson && (
            <div className="flex items-center gap-2 text-sm text-gray-600 font-open-sans">
              <Clock className="w-4 h-4" />
              {classItem.nextLesson.time}
            </div>
          )}
        </div>

        {classItem.status === 'active' && (
          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-1 font-open-sans">
              <span>Tiến độ</span>
              <span className="font-medium">{classItem.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary to-blue-600 h-2 rounded-full"
                style={{ width: `${classItem.progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
