import { 
  School, 
  Users, 
  UserCog, 
  DollarSign, 
  Clock, 
  FileCheck, 
  Calendar, 
  CheckCircle, 
  Star,
  LucideIcon 
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'yellow' | 'orange';
  trend?: string;
  alert?: boolean;
}

export function StatCard({ title, value, icon, color, trend, alert }: StatCardProps) {
  const colorClasses = {
    blue: 'from-primary to-blue-600',
    green: 'from-green-400 to-green-600',
    purple: 'from-purple-400 to-purple-600',
    yellow: 'from-secondary to-yellow-500',
    orange: 'from-orange-400 to-orange-600'
  };

  const getIcon = (iconName: string): LucideIcon => {
    const icons: Record<string, LucideIcon> = {
      school: School,
      users: Users,
      'user-tie': UserCog,
      dollar: DollarSign,
      clock: Clock,
      'file-check': FileCheck,
      calendar: Calendar,
      'check-circle': CheckCircle,
      star: Star
    };
    return icons[iconName] || School;
  };

  const IconComponent = getIcon(icon);

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow ${alert ? 'ring-2 ring-orange-400' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1 font-open-sans">{title}</p>
          <p className="text-3xl font-bold text-gray-900 font-poppins">{value}</p>
          {trend && (
            <p className="text-sm text-green-600 mt-2 font-medium font-open-sans">
              {trend} so với tháng trước
            </p>
          )}
        </div>
        <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-lg flex items-center justify-center`}>
          <IconComponent className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}
