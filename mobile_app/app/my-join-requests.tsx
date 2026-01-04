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
import { joinRequestService, JoinRequestResponse } from '../services/joinRequestService';

export default function MyJoinRequestsScreen() {
    const router = useRouter();

    const [requests, setRequests] = useState<JoinRequestResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<string>('all');

    const loadRequests = async () => {
        try {
            setIsLoading(true);
            const data = await joinRequestService.getMy();
            setRequests(data);
        } catch (error: any) {
            console.error('Error loading join requests:', error);
            Alert.alert('Lỗi', error.message || 'Không thể tải danh sách yêu cầu');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        loadRequests();
    }, []);

    const handleRefresh = () => {
        setIsRefreshing(true);
        loadRequests();
    };

    const handleCreateNewRequest = (classroomId: number) => {
        Alert.alert(
            'Gửi lại yêu cầu',
            'Bạn có muốn gửi lại yêu cầu tham gia lớp này?',
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Gửi',
                    onPress: async () => {
                        try {
                            await joinRequestService.create({ classroomId });
                            Alert.alert('Thành công', 'Đã gửi yêu cầu tham gia lớp');
                            loadRequests();
                        } catch (error: any) {
                            Alert.alert('Lỗi', error.message || 'Không thể gửi yêu cầu');
                        }
                    },
                },
            ]
        );
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
            case 'approved':
                return '#10B981';
            case 'pending':
                return '#F59E0B';
            case 'rejected':
                return '#EF4444';
            default:
                return '#9CA3AF';
        }
    };

    const getStatusText = (status: string): string => {
        switch (status) {
            case 'approved':
                return 'Đã duyệt';
            case 'pending':
                return 'Đang chờ';
            case 'rejected':
                return 'Bị từ chối';
            default:
                return status;
        }
    };

    const getStatusIcon = (status: string): string => {
        switch (status) {
            case 'approved':
                return 'checkmark-circle';
            case 'pending':
                return 'time';
            case 'rejected':
                return 'close-circle';
            default:
                return 'help-circle';
        }
    };

    const filteredRequests = requests.filter(request => {
        if (selectedStatus === 'all') return true;
        return request.status === selectedStatus;
    });

    const statusFilters = [
        { key: 'all', label: 'Tất cả', count: requests.length },
        { key: 'pending', label: 'Đang chờ', count: requests.filter(r => r.status === 'pending').length },
        { key: 'approved', label: 'Đã duyệt', count: requests.filter(r => r.status === 'approved').length },
        { key: 'rejected', label: 'Bị từ chối', count: requests.filter(r => r.status === 'rejected').length },
    ];

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Đang tải yêu cầu...</Text>
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
                    <Text style={styles.headerTitle}>Yêu cầu tham gia lớp</Text>
                </View>
            </View>

            {/* Status Filters */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filtersContainer}
                contentContainerStyle={styles.filtersContent}
            >
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
            </ScrollView>

            {/* Request List */}
            <ScrollView
                style={styles.content}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
                }
            >
                {filteredRequests.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="document-text-outline" size={64} color="#9CA3AF" />
                        <Text style={styles.emptyText}>Chưa có yêu cầu nào</Text>
                        <Text style={styles.emptySubtext}>
                            {selectedStatus === 'all'
                                ? 'Các yêu cầu tham gia lớp của bạn sẽ hiển thị ở đây'
                                : `Không có yêu cầu ${getStatusText(selectedStatus).toLowerCase()}`}
                        </Text>
                    </View>
                ) : (
                    filteredRequests.map(request => (
                        <View key={request.joinRequestId} style={styles.requestCard}>
                            <View style={styles.requestHeader}>
                                <View style={styles.requestInfo}>
                                    <Text style={styles.classroomName}>{request.classroomName}</Text>
                                    <Text style={styles.tutorName}>Giáo viên: {request.tutorName}</Text>
                                </View>
                                <View
                                    style={[
                                        styles.statusBadge,
                                        { backgroundColor: `${getStatusColor(request.status)}20` },
                                    ]}
                                >
                                    <Ionicons
                                        name={getStatusIcon(request.status) as any}
                                        size={16}
                                        color={getStatusColor(request.status)}
                                    />
                                    <Text style={[styles.statusText, { color: getStatusColor(request.status) }]}>
                                        {getStatusText(request.status)}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.requestDetails}>
                                <View style={styles.detailRow}>
                                    <Ionicons name="calendar" size={16} color="#6B7280" />
                                    <Text style={styles.detailLabel}>Ngày gửi:</Text>
                                    <Text style={styles.detailValue}>{formatDate(request.createdAt)}</Text>
                                </View>

                                {request.respondedAt && (
                                    <View style={styles.detailRow}>
                                        <Ionicons name="checkmark-done" size={16} color="#6B7280" />
                                        <Text style={styles.detailLabel}>Ngày phản hồi:</Text>
                                        <Text style={styles.detailValue}>{formatDate(request.respondedAt)}</Text>
                                    </View>
                                )}

                                {request.rejectionReason && (
                                    <View style={styles.reasonContainer}>
                                        <Text style={styles.reasonLabel}>Lý do từ chối:</Text>
                                        <Text style={styles.reasonText}>{request.rejectionReason}</Text>
                                    </View>
                                )}
                            </View>

                            {/* Actions */}
                            {request.status === 'rejected' && (
                                <TouchableOpacity
                                    style={styles.retryBtn}
                                    onPress={() => handleCreateNewRequest(request.classroomId)}
                                >
                                    <Ionicons name="refresh" size={20} color="#007AFF" />
                                    <Text style={styles.retryBtnText}>Gửi lại yêu cầu</Text>
                                </TouchableOpacity>
                            )}

                            {request.status === 'approved' && (
                                <TouchableOpacity
                                    style={styles.viewClassBtn}
                                    onPress={() => {
                                        router.push({
                                            pathname: '/classroom-detail',
                                            params: { id: request.classroomId.toString() },
                                        });
                                    }}
                                >
                                    <Ionicons name="arrow-forward-circle" size={20} color="white" />
                                    <Text style={styles.viewClassBtnText}>Xem lớp học</Text>
                                </TouchableOpacity>
                            )}
                        </View>
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
    },
    filtersContent: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 8,
    },
    filterBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        marginRight: 8,
        gap: 6,
    },
    filterBtnActive: {
        backgroundColor: '#007AFF',
    },
    filterText: {
        fontSize: 14,
        fontWeight: '500',
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
    requestCard: {
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
    requestHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    requestInfo: {
        flex: 1,
        marginRight: 12,
    },
    classroomName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    tutorName: {
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
    requestDetails: {
        gap: 8,
        marginBottom: 12,
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
    reasonContainer: {
        backgroundColor: '#FEF2F2',
        padding: 12,
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: '#EF4444',
    },
    reasonLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#991B1B',
        marginBottom: 4,
    },
    reasonText: {
        fontSize: 14,
        color: '#7F1D1D',
        lineHeight: 20,
    },
    retryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#EBF5FF',
        gap: 8,
    },
    retryBtnText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#007AFF',
    },
    viewClassBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#007AFF',
        gap: 8,
    },
    viewClassBtnText: {
        fontSize: 15,
        fontWeight: '600',
        color: 'white',
    },
});
