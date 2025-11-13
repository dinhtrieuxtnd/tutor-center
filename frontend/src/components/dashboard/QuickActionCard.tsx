import { 
  PlusCircle, 
  UserCog, 
  BarChart3, 
  DollarSign, 
  BookOpen, 
  FileEdit, 
  UserCheck, 
  Bot, 
  Search, 
  Calendar, 
  CreditCard,
  LucideIcon 
} from 'lucide-react';

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'yellow' | 'orange';
  badge?: number;
  onClick: () => void;
}

export function QuickActionCard({ title, description, icon, color, badge, onClick }: QuickActionCardProps) {
  const colorClasses = {
    blue: 'from-primary to-blue-600',
    green: 'from-green-400 to-green-600',
    purple: 'from-purple-400 to-purple-600',
    yellow: 'from-secondary to-yellow-500',
    orange: 'from-orange-400 to-orange-600'
  };

  const getActionIcon = (iconName: string): LucideIcon => {
    const icons: Record<string, LucideIcon> = {
      'plus-circle': PlusCircle,
      'user-tie': UserCog,
      'chart-bar': BarChart3,
      dollar: DollarSign,
      book: BookOpen,
      'file-edit': FileEdit,
      'user-check': UserCheck,
      robot: Bot,
      search: Search,
      calendar: Calendar,
      'credit-card': CreditCard
    };
    return icons[iconName] || PlusCircle;
  };

  const IconComponent = getActionIcon(icon);

  return (
    <button
      onClick={onClick}
      className="relative bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-gray-300 transition-all text-left group"
    >
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          {badge}
        </span>
      )}
      <div className="flex items-start space-x-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
          <IconComponent className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-gray-700 font-poppins">
            {title}
          </h3>
          <p className="text-sm text-gray-600 font-open-sans">{description}</p>
        </div>
      </div>
    </button>
  );
}
