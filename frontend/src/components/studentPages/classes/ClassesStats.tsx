import { BookOpen, CheckCircle, Hourglass } from 'lucide-react';
import { ClassStatsCard } from '@/components/class/classes';
import { ClassStats } from './types';

interface ClassesStatsProps {
  stats: ClassStats;
}

export function ClassesStats({ stats }: ClassesStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <ClassStatsCard
        label="Tổng lớp học"
        value={stats.total}
        icon={BookOpen}
        iconBgColor="bg-blue-100"
        iconColor="text-blue-600"
      />
      <ClassStatsCard
        label="Đang học"
        value={stats.active}
        icon={CheckCircle}
        iconBgColor="bg-green-100"
        iconColor="text-green-600"
        valueColor="text-green-600"
      />
      <ClassStatsCard
        label="Chờ duyệt"
        value={stats.pending}
        icon={Hourglass}
        iconBgColor="bg-yellow-100"
        iconColor="text-yellow-600"
        valueColor="text-yellow-600"
      />
      <ClassStatsCard
        label="Hoàn thành"
        value={stats.completed}
        icon={CheckCircle}
        iconBgColor="bg-gray-100"
        iconColor="text-gray-600"
        valueColor="text-gray-600"
      />
    </div>
  );
}
