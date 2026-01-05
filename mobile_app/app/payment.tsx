import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Platform,
    Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { paymentService } from '../services/paymentService';

export default function PaymentScreen() {
    const { classroomId, classroomName, price } = useLocalSearchParams<{
        classroomId: string;
        classroomName: string;
        price: string;
    }>();
    const router = useRouter();

    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayment = async () => {
        try {
            setIsProcessing(true);

            // Create payment transaction
            const result = await paymentService.createPayment({
                classroomId: Number(classroomId),
                returnUrl: 'tutorcenter://payment-return', // Deep link for mobile app
            });

            // Open VNPay payment URL
            const canOpen = await Linking.canOpenURL(result.paymentUrl);
            if (canOpen) {
                await Linking.openURL(result.paymentUrl);

                // Navigate to payment history after opening payment URL
                setTimeout(() => {
                    router.replace('/payment-history');
                }, 1000);
            } else {
                throw new Error('Không thể mở trang thanh toán');
            }
        } catch (error: any) {
            console.error('Error creating payment:', error);
            Alert.alert('Lỗi', error.message || 'Không thể tạo giao dịch thanh toán');
        } finally {
            setIsProcessing(false);
        }
    };

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Thanh toán học phí</Text>
                </View>
            </View>

            <ScrollView style={styles.content}>
                {/* Payment Info Card */}
                <View style={styles.infoCard}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="school" size={48} color="#007AFF" />
                    </View>

                    <Text style={styles.classroomName}>{classroomName}</Text>

                    <View style={styles.divider} />

                    <View style={styles.priceContainer}>
                        <Text style={styles.priceLabel}>Học phí</Text>
                        <Text style={styles.priceValue}>{formatCurrency(Number(price))}</Text>
                    </View>
                </View>

                {/* Payment Method */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>

                    <View style={styles.methodCard}>
                        <View style={styles.methodIcon}>
                            <Ionicons name="card" size={32} color="#007AFF" />
                        </View>
                        <View style={styles.methodInfo}>
                            <Text style={styles.methodName}>VNPay</Text>
                            <Text style={styles.methodDesc}>
                                Thanh toán qua ví điện tử, thẻ ATM, thẻ tín dụng
                            </Text>
                        </View>
                        <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                    </View>
                </View>

                {/* Payment Notes */}
                <View style={styles.notesCard}>
                    <View style={styles.noteItem}>
                        <Ionicons name="information-circle" size={20} color="#007AFF" />
                        <Text style={styles.noteText}>
                            Bạn sẽ được chuyển đến trang thanh toán VNPay
                        </Text>
                    </View>
                    <View style={styles.noteItem}>
                        <Ionicons name="shield-checkmark" size={20} color="#10B981" />
                        <Text style={styles.noteText}>
                            Giao dịch được bảo mật và an toàn
                        </Text>
                    </View>
                    <View style={styles.noteItem}>
                        <Ionicons name="time" size={20} color="#F59E0B" />
                        <Text style={styles.noteText}>
                            Vui lòng hoàn tất thanh toán trong 15 phút
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Tổng thanh toán</Text>
                    <Text style={styles.totalValue}>{formatCurrency(Number(price))}</Text>
                </View>

                <TouchableOpacity
                    style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
                    onPress={handlePayment}
                    disabled={isProcessing}
                >
                    {isProcessing ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <>
                            <Ionicons name="card" size={24} color="white" />
                            <Text style={styles.payButtonText}>Thanh toán ngay</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
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
    content: {
        flex: 1,
        padding: 16,
    },
    infoCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        marginBottom: 16,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#EBF5FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    classroomName: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: 16,
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: '#E5E7EB',
        marginBottom: 16,
    },
    priceContainer: {
        width: '100%',
        alignItems: 'center',
    },
    priceLabel: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 8,
    },
    priceValue: {
        fontSize: 32,
        fontWeight: '700',
        color: '#007AFF',
    },
    section: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 12,
    },
    methodCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#007AFF',
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
    methodIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#EBF5FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    methodInfo: {
        flex: 1,
    },
    methodName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    methodDesc: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 18,
    },
    notesCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        gap: 12,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
            },
            android: {
                elevation: 1,
            },
        }),
    },
    noteItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
    },
    noteText: {
        flex: 1,
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 20,
    },
    footer: {
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        padding: 16,
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    totalLabel: {
        fontSize: 16,
        color: '#6B7280',
    },
    totalValue: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1F2937',
    },
    payButton: {
        backgroundColor: '#007AFF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
    },
    payButtonDisabled: {
        backgroundColor: '#9CA3AF',
    },
    payButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});
