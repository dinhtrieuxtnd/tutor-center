import { User, Mail, Clock, Check, X } from 'lucide-react';
import { Spinner } from '../../../shared/components/loading/Loading';
import { Button } from '../../../shared/components/ui';

const STATUS_CONFIG = {
    PENDING: {
        label: 'Đang chờ',
        className: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        icon: Clock,
    },
    APPROVED: {
        label: 'Đã chấp nhận',
        className: 'bg-green-50 text-green-700 border-green-200',
        icon: Check,
    },
    REJECTED: {
        label: 'Đã từ chối',
        className: 'bg-red-50 text-red-700 border-red-200',
        icon: X,
    },
};

export const JoinRequestCard = ({ request, onApprove, onReject, isHandling }) => {
    const statusConfig = STATUS_CONFIG[request.status] || STATUS_CONFIG.PENDING;
    const StatusIcon = statusConfig.icon;
    const isPending = request.status === 'PENDING';

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="bg-primary border border-border rounded-sm p-4 hover:border-gray-300 transition-colors">
            <div className="flex items-start justify-between gap-4">
                {/* Student info */}
                <div className="flex items-center gap-3 flex-1">
                    {request.student?.avatarUrl ? (
                        <img
                            src={request.student.avatarUrl}
                            alt={request.student.fullName}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <User size={18} className="text-gray-400" />
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                            {request.student?.fullName || 'Không có tên'}
                        </p>
                        {request.student?.email && (
                            <div className="flex items-center gap-1 mt-1">
                                <Mail size={12} className="text-foreground-light" />
                                <p className="text-xs text-foreground-light truncate">
                                    {request.student.email}
                                </p>
                            </div>
                        )}
                        <div className="flex items-center gap-1 mt-1">
                            <Clock size={12} className="text-foreground-light" />
                            <p className="text-xs text-foreground-light">
                                {formatDate(request.requestedAt)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Status or actions */}
                <div className="flex items-center gap-2">
                    {isPending ? (
                        <>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onApprove(request)}
                                disabled={isHandling}
                                className="gap-1 border-success text-success hover:bg-success-bg"
                            >
                                {isHandling ? (
                                    <Spinner size="sm" />
                                ) : (
                                    <>
                                        <Check size={14} />
                                        Chấp nhận
                                    </>
                                )}
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onReject(request)}
                                disabled={isHandling}
                                className="gap-1 border-error text-error hover:bg-red-50"
                            >
                                {isHandling ? (
                                    <Spinner size="sm" />
                                ) : (
                                    <>
                                        <X size={14} />
                                        Từ chối
                                    </>
                                )}
                            </Button>
                        </>
                    ) : (
                        <div className={`flex items-center gap-1 px-3 py-1.5 rounded-sm border text-xs font-medium ${statusConfig.className}`}>
                            <StatusIcon size={14} />
                            {statusConfig.label}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
