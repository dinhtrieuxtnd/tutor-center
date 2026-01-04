import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Platform,
    RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { paymentService, PaymentResponse } from '../services/paymentService';

export default function PaymentHistoryScreen() {
    const router = useRouter();

    const [payments, setPayments] = useState<PaymentResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<string>('all');

    const loadPayments = async () => {
        try {
            setIsLoading(true);
            const data = await paymentService.getMyPayments();
            setPayments(data);
        } catch (error: any) {
            console.error('Error loading payments:', error);
            Alert.alert('Lỗi', error.message || 'Không thể tải lịch sử thanh toán');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        loadPayments();
    }, []);

    const handleRefresh = () => {
        setIsRefreshing(true);
        loadPayments();
    };

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusColor = (status: string): string => {
        switch (status) {
            case 'completed':
                return '#10B981';
            case 'pending':
                return '#F59E0B';
            case 'failed':
                return '#EF4444';
            case 'cancelled':
                return '#6B7280';
            default:
                return '#9CA3AF';
        }
    };

    const getStatusText = (status: string): string => {
        switch (status) {
            case 'completed':
                return 'Thành công';
            case 'pending':
                return 'Đang chờ';
            case 'failed':
                return 'Thất bại';
            case 'cancelled':
                return 'Đã hủy';
            default:
                return status;
        }
    };

    const getStatusIcon = (status: string): string => {
        switch (status) {
            case 'completed':
                return 'checkmark-circle';
            case 'pending':
                return 'time';
            case 'failed':
                return 'close-circle';
            case 'cancelled':
                return 'ban';
            default:
                return 'help-circle';
        }
    };

    const filteredPayments = payments.filter(payment => {
        if (selectedStatus === 'all') return true;
        return payment.status === selectedStatus;
    });

    const statusFilters = [
        { key: 'all', label: 'Tất cả', count: payments.length },
        { key: 'completed', label: 'Hoàn tất', count: payments.filter(p => p.status === 'completed').length },
        { key: 'pending', label: 'Chờ', count: payments.filter(p => p.status === 'pending').length },
        { key: 'failed', label: 'Lỗi', count: payments.filter(p => p.status === 'failed').length },
    ];

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Đang tải lịch sử...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Lịch sử thanh toán</Text>
                </View>
            </View>

            {/* Status Filters */}
            <View style={styles.filtersContainer}>
                {statusFilters.map(filter => (
                    <TouchableOpacity
                        key={filter.key}
                        style={[
                            styles.filterBtn,
                            selectedStatus === filter.key && styles.filterBtnActive,
                        ]}
                        onPress={() => setSelectedStatus(filter.key)}
                    >
                        <Text
                            style={[
                                styles.filterText,
                                selectedStatus === filter.key && styles.filterTextActive,
                            ]}
                        >
                            {filter.label}
                        </Text>
                        {filter.count > 0 && (
                            <View
                                style={[
                                    styles.filterBadge,
                                    selectedStatus === filter.key && styles.filterBadgeActive,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.filterBadgeText,
                                        selectedStatus === filter.key && styles.filterBadgeTextActive,
                                    ]}
                                >
                                    {filter.count}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </View>

            {/* Payment List */}
            <ScrollView
                style={styles.content}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
                }
            >
                {filteredPayments.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="receipt-outline" size={64} color="#9CA3AF" />
                        <Text style={styles.emptyText}>Chưa có giao dịch nào</Text>
                        <Text style={styles.emptySubtext}>
                            {selectedStatus === 'all'
                                ? 'Lịch sử thanh toán của bạn sẽ hiển thị ở đây'
                                : `Không có giao dịch ${getStatusText(selectedStatus).toLowerCase()}`}
                        </Text>
                    </View>
                ) : (
                    filteredPayments.map(payment => (
                        <TouchableOpacity
                            key={payment.transactionId}
                            style={styles.paymentCard}
                            onPress={() => {
                                Alert.alert(
                                    'Chi tiết giao dịch',
                                    `Mã giao dịch: ${payment.orderCode}\n` +
                                    `Lớp học: ${payment.classroomName}\n` +
                                    `Số tiền: ${formatCurrency(payment.amount)}\n` +
                                    `Trạng thái: ${getStatusText(payment.status)}\n` +
                                    `Ngày tạo: ${formatDate(payment.createdAt)}` +
                                    (payment.paidAt ? `\nNgày thanh toán: ${formatDate(payment.paidAt)}` : '') +
                                    (payment.vnpayTransactionNo ? `\nMã GD VNPay: ${payment.vnpayTransactionNo}` : ''),
                                    [{ text: 'Đóng' }]
                                );
                            }}
                        >
                            <View style={styles.paymentHeader}>
                                <View style={styles.paymentInfo}>
                                    <Text style={styles.classroomName}>{payment.classroomName}</Text>
                                    <Text style={styles.orderCode}>Mã GD: {payment.orderCode}</Text>
                                </View>
                                <View
                                    style={[
                                        styles.statusBadge,
                                        { backgroundColor: `${getStatusColor(payment.status)}20` },
                                    ]}
                                >
                                    <Ionicons
                                        name={getStatusIcon(payment.status) as any}
                                        size={16}
                                        color={getStatusColor(payment.status)}
                                    />
                                    <Text style={[styles.statusText, { color: getStatusColor(payment.status) }]}>
                                        {getStatusText(payment.status)}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.paymentDetails}>
                                <View style={styles.detailRow}>
                                    <Ionicons name="cash" size={16} color="#6B7280" />
                                    <Text style={styles.detailLabel}>Số tiền:</Text>
                                    <Text style={styles.detailValue}>{formatCurrency(payment.amount)}</Text>
                                </View>

                                <View style={styles.detailRow}>
                                    <Ionicons name="calendar" size={16} color="#6B7280" />
                                    <Text style={styles.detailLabel}>Ngày tạo:</Text>
                                    <Text style={styles.detailValue}>{formatDate(payment.createdAt)}</Text>
                                </View>

                                {payment.paidAt && (
                                    <View style={styles.detailRow}>
                                        <Ionicons name="checkmark-done" size={16} color="#10B981" />
                                        <Text style={styles.detailLabel}>Đã thanh toán:</Text>
                                        <Text style={styles.detailValue}>{formatDate(payment.paidAt)}</Text>
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>
                    ))
                )}

                <View style={{ height: 24 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#6B7280',
    },
    header: {
        backgroundColor: '#007AFF',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 50 : 16,
        paddingBottom: 16,
    },
    backBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContent: {
        flex: 1,
        marginLeft: 8,
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    filtersContainer: {
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        flexDirection: 'row',
        paddingHorizontal: 12,
        paddingVertical: 12,
        gap: 8,
    },
    filterBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
        paddingVertical: 8,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        gap: 4,
    },
    filterBtnActive: {
        backgroundColor: '#007AFF',
    },
    filterText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B7280',
    },
    filterTextActive: {
        color: 'white',
    },
    filterBadge: {
        backgroundColor: '#E5E7EB',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        minWidth: 24,
        alignItems: 'center',
    },
    filterBadgeActive: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    filterBadgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#4B5563',
    },
    filterBadgeTextActive: {
        color: 'white',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 64,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
    },
    emptySubtext: {
        marginTop: 8,
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
    },
    paymentCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    paymentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    paymentInfo: {
        flex: 1,
        marginRight: 12,
    },
    classroomName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    orderCode: {
        fontSize: 13,
        color: '#6B7280',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 4,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    paymentDetails: {
        gap: 8,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    detailLabel: {
        fontSize: 14,
        color: '#6B7280',
        flex: 1,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1F2937',
    },
});
