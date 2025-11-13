import { UserPlus, BookOpen, FileCheck, DollarSign, LucideIcon } from 'lucide-react';

export interface ActivityItem {
  id: number;
  type: 'join_request' | 'new_lesson' | 'exercise_submitted' | 'payment' | 'announcement';
  message: string;
  time: string;
  user?: string;
  icon: string;
  color: string;
}

interface ActivityCardProps {
  activity: ActivityItem;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const iconColors = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    yellow: 'bg-yellow-100 text-yellow-600'
  };

  const getActivityIcon = (iconName: string): LucideIcon => {
    const icons: Record<string, LucideIcon> = {
      'user-plus': UserPlus,
      book: BookOpen,
      'file-check': FileCheck,
      dollar: DollarSign
    };
    return icons[iconName] || BookOpen;
  };

  const IconComponent = getActivityIcon(activity.icon);

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex space-x-3">
        <div className={`flex-shrink-0 w-10 h-10 rounded-full ${iconColors[activity.color as keyof typeof iconColors]} flex items-center justify-center`}>
          <IconComponent className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-900 mb-1 font-open-sans">{activity.message}</p>
          <p className="text-xs text-gray-500 font-open-sans">{activity.time}</p>
        </div>
      </div>
    </div>
  );
}
