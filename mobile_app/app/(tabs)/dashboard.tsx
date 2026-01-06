import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { classroomService, ClassroomResponse } from '../../services/classroomService';
import { exerciseSubmissionService, ExerciseSubmissionResponse } from '../../services/exerciseSubmissionService';
import { paymentService, PaymentResponse } from '../../services/paymentService';

const { width } = Dimensions.get('window');

interface DashboardStats {
  totalClasses: number;
  totalSubmissions: number;
  averageGrade: number;
  paidClasses: number;
}

export default function DashboardScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalClasses: 0,
    totalSubmissions: 0,
    averageGrade: 0,
    paidClasses: 0,
  });
  const [classrooms, setClassrooms] = useState<ClassroomResponse[]>([]);
  const [submissions, setSubmissions] = useState<ExerciseSubmissionResponse[]>([]);
  const [payments, setPayments] = useState<PaymentResponse[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Refresh data when dashboard tab is focused
  useFocusEffect(
    React.useCallback(() => {
      loadDashboardData();
    }, [])
  );

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      console.log('📊 Loading dashboard data...');
      
      // Gọi các API song song
      const [classroomsData, submissionsData, paymentsData] = await Promise.all([
        classroomService.getMyEnrollments()
          .then(data => {
            console.log('✅ Classrooms loaded:', data);
            return data;
          })
          .catch(err => {
            console.error('❌ Error loading classrooms:', err.message);
            return [];
          }),
        exerciseSubmissionService.getMySubmissions()
          .then(data => {
            console.log('✅ Submissions loaded:', data.length, 'items');
            return data;
          })
          .catch(err => {
            console.error('❌ Error loading submissions:', err.message);
            return [];
          }),
        paymentService.getMyPayments()
          .then(data => {
            console.log('✅ Payments loaded:', data.length, 'items');
            return data;
          })
          .catch(err => {
            console.error('❌ Error loading payments:', err.message);
            return [];
          }),
      ]);

      const classroomsList = classroomsData || [];
      console.log('📚 Total classrooms:', classroomsList.length);
      console.log('📝 Total submissions:', submissionsData.length);
      console.log('💰 Total payments:', paymentsData.length);
      
      // Don't modify hasPaid - payment API doesn't return classroomId
      // Backend should handle this via ClassroomStudents.HasPaid
      
      setClassrooms(classroomsList);
      setSubmissions(submissionsData);
      setPayments(paymentsData);

      // Tính toán thống kê
      const gradedSubmissions = submissionsData.filter((s: ExerciseSubmissionResponse) => s.score != null);
      const avgGrade = gradedSubmissions.length > 0
        ? gradedSubmissions.reduce((sum: number, s: ExerciseSubmissionResponse) => sum + (s.score || 0), 0) / gradedSubmissions.length
        : 0;

      const paidCount = paymentsData.filter((p: PaymentResponse) => p.status === 'paid').length;

      const calculatedStats = {
        totalClasses: classroomsList.length,
        totalSubmissions: submissionsData.length,
        averageGrade: Math.round(avgGrade * 10) / 10,
        paidClasses: paidCount,
      };
      
      console.log('📊 Stats:', calculatedStats);
      setStats(calculatedStats);
    } catch (error) {
      console.error('❌ Error loading dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Thống kê cards với dữ liệu thực
  const statsCards = [
    {
      title: 'Lớp học',
      value: stats.totalClasses,
      description: 'Đã tham gia',
      icon: 'school-outline' as const,
      color: '#3B82F6',
      bgColor: '#EFF6FF',
      trend: stats.paidClasses > 0 ? `${stats.paidClasses} đã thanh toán` : 'Chưa thanh toán',
    },
    {
      title: 'Bài tập',
      value: stats.totalSubmissions,
      description: 'Đã nộp',
      icon: 'document-text-outline' as const,
      color: '#10B981',
      bgColor: '#F0FDF4',
      trend: stats.averageGrade > 0 ? `Điểm TB: ${stats.averageGrade}` : 'Chưa có điểm',
    },
    {
      title: 'Thanh toán',
      value: stats.paidClasses,
      description: 'Hoàn tất',
      icon: 'card-outline' as const,
      color: '#F59E0B',
      bgColor: '#FFFBEB',
      trend: `${payments.length} giao dịch`,
    },
  ];

  // Tính tiến độ theo lớp (số bài tập đã nộp / tổng bài tập)
  const getClassProgress = (classroom: ClassroomResponse) => {
    // Note: ExerciseSubmissionResponse doesn't have classroomId, so we can't filter by classroom
    // For now, just show total submissions divided by number of classes
    const submissionsPerClass = Math.floor(submissions.length / (classrooms.length || 1));
    // Giả sử mỗi lớp có khoảng 10-15 bài (có thể điều chỉnh)
    const estimatedTotal = 12;
    const completed = submissionsPerClass;
    const percentage = Math.min((completed / estimatedTotal) * 100, 100);
    return { completed, total: estimatedTotal, percentage };
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Dashboard Học viên</Text>
            <Text style={styles.headerSubtitle}>
              Chào mừng trở lại, {user?.fullName || 'Học viên'}!
            </Text>
          </View>
        </View>

        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          {statsCards.map((stat, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.statCard, { backgroundColor: stat.bgColor }]}
              activeOpacity={0.7}
            >
              <View style={styles.statContent}>
                <View style={styles.statHeader}>
                  <Text style={[styles.statTitle, { color: stat.color }]}>
                    {stat.title}
                  </Text>
                  <Ionicons name={stat.icon} size={32} color={stat.color} />
                </View>
                <Text style={[styles.statValue, { color: stat.color }]}>
                  {stat.value}
                </Text>
                <Text style={[styles.statDescription, { color: stat.color }]}>
                  {stat.description}
                </Text>
                <View style={styles.statTrend}>
                  <Ionicons name="information-circle" size={12} color={stat.color} />
                  <Text style={[styles.statTrendText, { color: stat.color }]}>
                    {stat.trend}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Progress Section */}
        {classrooms.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="analytics-outline" size={24} color="#3B82F6" />
              <Text style={styles.sectionTitle}>Tiến độ học tập</Text>
            </View>
            <View style={styles.card}>
              {classrooms.slice(0, 5).map((classroom, index) => {
                const progress = getClassProgress(classroom);
                const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899'];
                const color = colors[index % colors.length];
                
                return (
                  <View key={classroom.id} style={styles.progressItem}>
                    <View style={styles.progressHeader}>
                      <Text style={styles.progressClassName} numberOfLines={1}>
                        {classroom.name}
                      </Text>
                      <Text style={styles.progressStats}>
                        {progress.completed}/{progress.total} bài ({Math.round(progress.percentage)}%)
                      </Text>
                    </View>
                    <View style={styles.progressBarContainer}>
                      <View
                        style={[
                          styles.progressBar,
                          {
                            width: `${progress.percentage}%`,
                            backgroundColor: color,
                          },
                        ]}
                      />
                    </View>
                  </View>
                );
              })}
              {classrooms.length > 0 && (
                <View style={styles.totalProgress}>
                  <Text style={styles.totalProgressLabel}>Tổng số lớp</Text>
                  <Text style={styles.totalProgressValue}>
                    {classrooms.length}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Recent Payments Section */}
        {payments.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="cash-outline" size={24} color="#3B82F6" />
              <Text style={styles.sectionTitle}>Giao dịch gần đây</Text>
            </View>
            <View style={styles.paymentsContainer}>
              {payments.slice(0, 3).map((payment) => (
                <View key={payment.transactionId} style={styles.paymentCard}>
                  <View style={styles.paymentIcon}>
                    <Ionicons
                      name={payment.status === 'paid' ? 'checkmark-circle' : 'time-outline'}
                      size={24}
                      color={payment.status === 'paid' ? '#10B981' : '#F59E0B'}
                    />
                  </View>
                  <View style={styles.paymentContent}>
                    <Text style={styles.paymentOrder}>Mã: {payment.orderCode}</Text>
                    <Text style={styles.paymentAmount}>
                      {payment.amount.toLocaleString('vi-VN')} VNĐ
                    </Text>
                    <Text style={styles.paymentDate}>
                      {new Date(payment.createdAt).toLocaleDateString('vi-VN')}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.paymentStatusBadge,
                      { backgroundColor: payment.status === 'paid' ? '#10B98120' : '#F59E0B20' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.paymentStatusText,
                        { color: payment.status === 'paid' ? '#10B981' : '#F59E0B' },
                      ]}
                    >
                      {payment.status === 'paid' ? 'Đã thanh toán' : 'Chờ xử lý'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Empty State */}
        {classrooms.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="school-outline" size={64} color="#9CA3AF" />
            <Text style={styles.emptyStateText}>Chưa tham gia lớp học nào</Text>
            <Text style={styles.emptyStateSubtext}>
              Hãy tìm và đăng ký các lớp học phù hợp với bạn
            </Text>
          </View>
        )}

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
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
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  statsContainer: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: (width - 52) / 2,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statContent: {
    gap: 4,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statDescription: {
    fontSize: 11,
    opacity: 0.8,
    marginBottom: 4,
  },
  statTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statTrendText: {
    fontSize: 10,
    fontWeight: '500',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  progressItem: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressClassName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
    marginRight: 8,
  },
  progressStats: {
    fontSize: 12,
    color: '#6B7280',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  totalProgress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginTop: 4,
  },
  totalProgressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  totalProgressValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10B981',
  },
  paymentsContainer: {
    gap: 12,
  },
  paymentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentContent: {
    flex: 1,
    gap: 2,
  },
  paymentOrder: {
    fontSize: 12,
    color: '#6B7280',
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  paymentDate: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  paymentStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  paymentStatusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 24,
  },
});
