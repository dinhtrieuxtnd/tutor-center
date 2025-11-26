import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const { user } = useAuth();

  // Mock data - Thống kê
  const stats = [
    {
      title: 'Lớp học',
      value: 4,
      description: 'Đã tham gia',
      icon: 'school-outline' as const,
      color: '#3B82F6',
      bgColor: '#EFF6FF',
      trend: '+1 lớp mới',
    },
    {
      title: 'Bài tập',
      value: 18,
      description: 'Đã nộp',
      icon: 'document-text-outline' as const,
      color: '#10B981',
      bgColor: '#F0FDF4',
      trend: '12/15 đạt điểm tốt',
    },
    {
      title: 'Bài kiểm tra',
      value: 6,
      description: 'Đã hoàn thành',
      icon: 'clipboard-outline' as const,
      color: '#8B5CF6',
      bgColor: '#F5F3FF',
      trend: 'Điểm TB: 8.5',
    },
    {
      title: 'Điểm TB',
      value: '8.5',
      description: 'Tổng quát',
      icon: 'trophy-outline' as const,
      color: '#F59E0B',
      bgColor: '#FFFBEB',
      trend: '+0.5 so với kỳ trước',
    },
  ];

  // Mock data - Tiến độ học tập theo lớp
  const progressByClass = [
    {
      className: 'Toán 12 - Chuyên đề hàm số',
      completed: 12,
      total: 15,
      percentage: 80,
      color: '#3B82F6',
    },
    {
      className: 'Vật lý 11',
      completed: 8,
      total: 10,
      percentage: 80,
      color: '#10B981',
    },
    {
      className: 'Hóa học 10',
      completed: 9,
      total: 12,
      percentage: 75,
      color: '#8B5CF6',
    },
    {
      className: 'Toán 10 - Cơ bản',
      completed: 14,
      total: 16,
      percentage: 87.5,
      color: '#F59E0B',
    },
  ];

  // Mock data - Thông báo
  const notifications = [
    {
      id: 1,
      className: 'Toán 12 - Chuyên đề hàm số',
      teacher: 'Thầy Nguyễn Văn A',
      announcement: 'Bài tập tuần 5 đã được đăng. Hạn nộp: 25/11/2025',
      time: '30 phút trước',
      priority: 'high' as const,
      type: 'exercise' as const,
      icon: 'create-outline' as const,
    },
    {
      id: 2,
      className: 'Vật lý 11',
      teacher: 'Cô Trần Thị B',
      announcement: 'Bài kiểm tra giữa kỳ sẽ diễn ra vào 20/11/2025',
      time: '1 giờ trước',
      priority: 'high' as const,
      type: 'quiz' as const,
      icon: 'stats-chart-outline' as const,
    },
    {
      id: 3,
      className: 'Hóa học 10',
      teacher: 'Thầy Lê Văn C',
      announcement: 'Lớp học ngày mai sẽ bắt đầu lúc 2:00 PM',
      time: '2 giờ trước',
      priority: 'medium' as const,
      type: 'class' as const,
      icon: 'home-outline' as const,
    },
    {
      id: 4,
      className: 'Toán 10 - Cơ bản',
      teacher: 'Cô Phạm Thị D',
      announcement: 'Bài giảng mới về phương trình đã được cập nhật',
      time: '3 giờ trước',
      priority: 'low' as const,
      type: 'lecture' as const,
      icon: 'book-outline' as const,
    },
  ];

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  const getPriorityLabel = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return 'Quan trọng';
      case 'medium':
        return 'Bình thường';
      case 'low':
        return 'Thông tin';
      default:
        return 'Thông tin';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
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
          {stats.map((stat, index) => (
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
                  <Ionicons name="trending-up" size={12} color={stat.color} />
                  <Text style={[styles.statTrendText, { color: stat.color }]}>
                    {stat.trend}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Progress Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="analytics-outline" size={24} color="#3B82F6" />
            <Text style={styles.sectionTitle}>Tiến độ học tập</Text>
          </View>
          <View style={styles.card}>
            {progressByClass.map((item, index) => (
              <View key={index} style={styles.progressItem}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressClassName} numberOfLines={1}>
                    {item.className}
                  </Text>
                  <Text style={styles.progressStats}>
                    {item.completed}/{item.total} bài ({Math.round(item.percentage)}%)
                  </Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View
                    style={[
                      styles.progressBar,
                      {
                        width: `${item.percentage}%`,
                        backgroundColor: item.color,
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
            <View style={styles.totalProgress}>
              <Text style={styles.totalProgressLabel}>Tổng tiến độ</Text>
              <Text style={styles.totalProgressValue}>
                {Math.round(
                  progressByClass.reduce((sum, item) => sum + item.percentage, 0) /
                    progressByClass.length
                )}%
              </Text>
            </View>
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="notifications-outline" size={24} color="#3B82F6" />
            <Text style={styles.sectionTitle}>Thông báo mới</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>Xem tất cả</Text>
              <Ionicons name="chevron-forward" size={16} color="#3B82F6" />
            </TouchableOpacity>
          </View>
          <View style={styles.notificationsContainer}>
            {notifications.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                style={styles.notificationCard}
                activeOpacity={0.7}
              >
                <View style={styles.notificationIcon}>
                  <Ionicons
                    name={notification.icon}
                    size={24}
                    color={getPriorityColor(notification.priority)}
                  />
                </View>
                <View style={styles.notificationContent}>
                  <View style={styles.notificationHeader}>
                    <Text style={styles.notificationClassName} numberOfLines={1}>
                      {notification.className}
                    </Text>
                    <View
                      style={[
                        styles.priorityBadge,
                        { backgroundColor: getPriorityColor(notification.priority) + '20' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.priorityText,
                          { color: getPriorityColor(notification.priority) },
                        ]}
                      >
                        {getPriorityLabel(notification.priority)}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.notificationTeacher}>
                    {notification.teacher}
                  </Text>
                  <Text style={styles.notificationAnnouncement} numberOfLines={2}>
                    {notification.announcement}
                  </Text>
                  <Text style={styles.notificationTime}>{notification.time}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

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
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewAllText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
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
  notificationsContainer: {
    gap: 12,
  },
  notificationCard: {
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
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContent: {
    flex: 1,
    gap: 4,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  notificationClassName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  notificationTeacher: {
    fontSize: 12,
    color: '#6B7280',
  },
  notificationAnnouncement: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
  },
  notificationTime: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 4,
  },
  bottomSpacing: {
    height: 24,
  },
});
