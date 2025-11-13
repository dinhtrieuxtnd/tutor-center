import { Users, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

export type UserRole = 'admin' | 'teacher' | 'student';

export interface ClassroomItem {
  id: number;
  title: string;
  teacher: string;
  students: number;
  nextLesson?: string;
  status: 'active' | 'pending' | 'completed';
  progress?: number;
}

interface ClassroomCardProps {
  classroom: ClassroomItem;
  userRole: UserRole;
}

export function ClassroomCard({ classroom, userRole }: ClassroomCardProps) {
  const router = useRouter();
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-gray-100 text-gray-800'
  };

  const statusLabels = {
    active: 'Đang học',
    pending: 'Chờ bắt đầu',
    completed: 'Đã hoàn thành'
  };

  const handleClick = () => {
    router.push(`/student/class/${classroom.id}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-900 mb-1 font-poppins">{classroom.title}</h3>
          <p className="text-sm text-gray-600 font-open-sans">{classroom.teacher}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[classroom.status]}`}>
          {statusLabels[classroom.status]}
        </span>
      </div>
      
      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3 font-open-sans">
        <div className="flex items-center">
          <Users className="w-4 h-4 mr-1" />
          {classroom.students} học sinh
        </div>
        {classroom.nextLesson && (
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {classroom.nextLesson}
          </div>
        )}
      </div>

      {classroom.progress !== undefined && (
        <div>
          <div className="flex justify-between text-xs text-gray-600 mb-1 font-open-sans">
            <span>Tiến độ học tập</span>
            <span className="font-medium">{classroom.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary to-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${classroom.progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
