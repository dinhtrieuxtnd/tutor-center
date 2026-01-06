import { User, Mail, Trash2 } from 'lucide-react';
import { Spinner } from '../../../shared/components/loading/Loading';

export const StudentCard = ({ student, onRemove, isRemoving }) => {
    return (
        <div className="bg-primary border border-border rounded-sm p-4 hover:border-gray-300 transition-colors">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                    {student.avatarUrl ? (
                        <img
                            src={student.avatarUrl}
                            alt={student.fullName}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <User size={18} className="text-gray-400" />
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                            {student.fullName}
                        </p>
                        {student.email && (
                            <div className="flex items-center gap-1 mt-1">
                                <Mail size={12} className="text-foreground-light" />
                                <p className="text-xs text-foreground-light truncate">
                                    {student.email}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
                <button
                    onClick={() => onRemove(student)}
                    disabled={isRemoving}
                    className="p-2 hover:bg-red-50 rounded-sm text-foreground-light hover:text-error transition-colors disabled:opacity-50"
                    title="Xóa học sinh"
                >
                    {isRemoving ? (
                        <Spinner size="sm" />
                    ) : (
                        <Trash2 size={16} />
                    )}
                </button>
            </div>
        </div>
    );
};
