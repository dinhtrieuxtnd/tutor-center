import { DollarSign, CheckCircle, XCircle, Clock } from 'lucide-react';
import { ButtonLoading } from '../../../shared/components/loading';

export const PaymentsTable = ({ payments, loading }) => {
    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <ButtonLoading message="Đang tải danh sách thanh toán..." />
            </div>
        );
    }

    if (payments.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-sm text-foreground-light">Chưa có giao dịch thanh toán nào</p>
            </div>
        );
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'Success': {
                label: 'Thành công',
                class: 'bg-success-bg text-success',
                icon: CheckCircle
            },
            'Pending': {
                label: 'Đang xử lý',
                class: 'bg-warning-bg text-warning',
                icon: Clock
            },
            'Failed': {
                label: 'Thất bại',
                class: 'bg-red-50 text-red-600',
                icon: XCircle
            },
        };
        const config = statusConfig[status] || {
            label: status,
            class: 'bg-gray-100 text-foreground',
            icon: DollarSign
        };
        const Icon = config.icon;
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-sm text-xs font-medium ${config.class}`}>
                <Icon size={12} />
                {config.label}
            </span>
        );
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-border">
                    <tr>
                        <th className="px-3 py-2 text-left font-semibold text-foreground w-12">ID</th>
                        <th className="px-3 py-2 text-left font-semibold text-foreground">Học sinh</th>
                        <th className="px-3 py-2 text-left font-semibold text-foreground">Mã đơn hàng</th>
                        <th className="px-3 py-2 text-right font-semibold text-foreground">Số tiền</th>
                        <th className="px-3 py-2 text-left font-semibold text-foreground">Phương thức</th>
                        <th className="px-3 py-2 text-left font-semibold text-foreground">Thời gian</th>
                        <th className="px-3 py-2 text-center font-semibold text-foreground w-32">Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map((payment) => (
                        <tr key={payment.id} className="border-b border-border hover:bg-gray-50 transition-colors">
                            <td className="px-3 py-3 text-foreground-light">
                                {payment.id}
                            </td>
                            <td className="px-3 py-3">
                                <div>
                                    <div className="text-foreground font-medium">
                                        {payment.student?.fullName || 'N/A'}
                                    </div>
                                    <div className="text-xs text-foreground-light">
                                        {payment.student?.email || ''}
                                    </div>
                                </div>
                            </td>
                            <td className="px-3 py-3 text-foreground font-mono text-xs">
                                {payment.orderCode || 'N/A'}
                            </td>
                            <td className="px-3 py-3 text-right">
                                <span className="text-foreground font-semibold">
                                    {formatCurrency(payment.amount)}
                                </span>
                            </td>
                            <td className="px-3 py-3">
                                <span className="text-xs px-2 py-1 bg-info-bg text-info rounded-sm font-medium">
                                    {payment.paymentMethod || 'VNPay'}
                                </span>
                            </td>
                            <td className="px-3 py-3 text-foreground-light text-xs">
                                {formatDate(payment.createdAt)}
                            </td>
                            <td className="px-3 py-3 text-center">
                                {getStatusBadge(payment.status)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
