import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { classroomService, ClassroomResponse } from '../services/classroomService';
import { joinRequestService, JoinRequestResponse } from '../services/joinRequestService';
import { lessonService, LessonResponse } from '../services/lessonService';
import { useAuth } from '../contexts/AuthContext';
import LessonsTab from '../components/LessonsTab';

export default function ClassroomDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [classroom, setClassroom] = useState<ClassroomResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [myRequests, setMyRequests] = useState<JoinRequestResponse[]>([]);
  const [isJoining, setIsJoining] = useState(false);
  const [enrolledClassrooms, setEnrolledClassrooms] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<'info' | 'lessons'>('info');
  const [lessons, setLessons] = useState<LessonResponse[]>([]);
  const [isLoadingLessons, setIsLoadingLessons] = useState(false);

  const fetchClassroomDetail = async (showLoader = true) => {
    try {
      if (showLoader) {
        setIsLoading(true);
      }
      const [classroomData, requestsData, enrolledData] = await Promise.all([
        classroomService.getById(Number(id)),
        joinRequestService.getMy().catch(() => []),
        classroomService.getMyEnrollments().catch(() => []),
      ]);
      
      setClassroom(classroomData);
      setMyRequests(requestsData);
      setEnrolledClassrooms(enrolledData.map(c => c.classroomId));
    } catch (error: any) {
      console.error('Error fetching classroom detail:', error);
      Alert.alert('Lỗi', error.message || 'Không thể tải thông tin lớp học', [
        {
          text: 'Quay lại',
          onPress: () => router.back(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const fetchLessons = async () => {
    if (!id) return;
    
    setIsLoadingLessons(true);
    try {
      const lessonsData = await lessonService.getByClassroom(Number(id));
      setLessons(lessonsData);
    } catch (error: any) {
      console.error('Error fetching lessons:', error);
      Alert.alert('Lỗi', error.message || 'Không thể tải danh sách bài học');
    } finally {
      setIsLoadingLessons(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchClassroomDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (activeTab === 'lessons' && lessons.length === 0) {
      fetchLessons();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchClassroomDetail(false);
  };

  const handleJoinRequest = async () => {
    if (!user || !classroom) return;

    setIsJoining(true);
    try {
      await joinRequestService.create({
        classroomId: classroom.classroomId,
        studentId: user.userId,
      });

      Alert.alert('Thành công', 'Đã gửi yêu cầu tham gia. Vui lòng chờ giáo viên duyệt.');
      fetchClassroomDetail(false);
    } catch (error: any) {
      console.error('Error creating join request:', error);
      Alert.alert('Lỗi', error.message || 'Không thể gửi yêu cầu tham gia');
    } finally {
      setIsJoining(false);
    }
  };

  const getEnrollmentStatus = () => {
    if (!classroom) return null;

    const isEnrolled = enrolledClassrooms.includes(classroom.classroomId);
    if (isEnrolled) {
      return { type: 'enrolled' as const, text: 'Đã tham gia', color: '#34C759' };
    }

    const pendingRequest = myRequests.find(
      r => r.classroomId === classroom.classroomId && r.status === 'pending'
    );
    if (pendingRequest) {
      return { type: 'pending' as const, text: 'Đang chờ duyệt', color: '#FF9500' };
    }

    const rejectedRequest = myRequests.find(
      r => r.classroomId === classroom.classroomId && r.status === 'rejected'
    );
    if (rejectedRequest) {
      return { type: 'rejected' as const, text: 'Đã bị từ chối', color: '#FF3B30' };
    }

    return { type: 'not-enrolled' as const, text: 'Gửi yêu cầu tham gia', color: '#007AFF' };
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Đang tải thông tin lớp học...</Text>
      </View>
    );
  }

  if (!classroom) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={80} color="#FF3B30" />
        <Text style={styles.errorText}>Không tìm thấy thông tin lớp học</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Chi tiết lớp học
        </Text>
        <View style={styles.headerRight} />
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'info' && styles.activeTab]}
          onPress={() => setActiveTab('info')}
        >
          <Ionicons
            name="information-circle"
            size={20}
            color={activeTab === 'info' ? '#007AFF' : '#666'}
          />
          <Text style={[styles.tabText, activeTab === 'info' && styles.activeTabText]}>
            Thông tin
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'lessons' && styles.activeTab]}
          onPress={() => setActiveTab('lessons')}
        >
          <Ionicons
            name="book"
            size={20}
            color={activeTab === 'lessons' ? '#007AFF' : '#666'}
          />
          <Text style={[styles.tabText, activeTab === 'lessons' && styles.activeTabText]}>
            Bài học
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === 'info' ? (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={['#007AFF']}
              tintColor="#007AFF"
            />
          }
        >
        {/* Main Info Card */}
        <View style={styles.mainCard}>
          <View style={styles.iconHeader}>
            <View style={styles.iconCircle}>
              <Ionicons name="school" size={40} color="#007AFF" />
            </View>
            {classroom.isArchived && (
              <View style={styles.archivedBadge}>
                <Text style={styles.archivedText}>Đã lưu trữ</Text>
              </View>
            )}
          </View>

          <Text style={styles.className}>{classroom.name}</Text>

          {classroom.description && (
            <Text style={styles.description}>{classroom.description}</Text>
          )}
        </View>

        {/* Information Cards */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Thông tin giảng viên</Text>
          <View style={styles.infoRow}>
            <Ionicons name="person" size={20} color="#007AFF" />
            <Text style={styles.infoLabel}>Giảng viên:</Text>
            <Text style={styles.infoValue}>{classroom.tutorName}</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Thông tin lớp học</Text>

          <View style={styles.infoRow}>
            <Ionicons name="people" size={20} color="#007AFF" />
            <Text style={styles.infoLabel}>Số học sinh:</Text>
            <Text style={styles.infoValue}>{classroom.studentCount} học sinh</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons name="cash" size={20} color="#007AFF" />
            <Text style={styles.infoLabel}>Học phí:</Text>
            <Text style={[styles.infoValue, styles.priceText]}>
              {formatPrice(classroom.price)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons name="calendar" size={20} color="#007AFF" />
            <Text style={styles.infoLabel}>Ngày tạo:</Text>
            <Text style={styles.infoValue}>{formatDate(classroom.createdAt)}</Text>
          </View>

          {classroom.isArchived && (
            <>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Ionicons name="archive" size={20} color="#FF9500" />
                <Text style={styles.infoLabel}>Trạng thái:</Text>
                <Text style={[styles.infoValue, styles.archivedStatusText]}>
                  Đã lưu trữ
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Enrollment Status / Action Button */}
        {(() => {
          const status = getEnrollmentStatus();
          if (!status) return null;

          if (status.type === 'enrolled') {
            return (
              <View style={styles.enrolledBanner}>
                <Ionicons name="checkmark-circle" size={24} color={status.color} />
                <Text style={[styles.enrolledText, { color: status.color }]}>
                  {status.text}
                </Text>
              </View>
            );
          }

          if (status.type === 'pending') {
            return (
              <View style={styles.pendingBanner}>
                <Ionicons name="time" size={24} color={status.color} />
                <Text style={[styles.pendingText, { color: status.color }]}>
                  {status.text}
                </Text>
              </View>
            );
          }

          if (status.type === 'rejected') {
            return (
              <View style={styles.rejectedBanner}>
                <Ionicons name="close-circle" size={24} color={status.color} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.rejectedText, { color: status.color }]}>
                    {status.text}
                  </Text>
                  <Text style={styles.rejectedSubtext}>
                    Bạn có thể gửi lại yêu cầu tham gia
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={handleJoinRequest}
                  disabled={isJoining}
                >
                  {isJoining ? (
                    <ActivityIndicator size="small" color="#007AFF" />
                  ) : (
                    <Text style={styles.retryButtonText}>Gửi lại</Text>
                  )}
                </TouchableOpacity>
              </View>
            );
          }

          // not-enrolled
          return (
            <TouchableOpacity
              style={styles.joinButton}
              onPress={handleJoinRequest}
              disabled={isJoining}
            >
              {isJoining ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Ionicons name="add-circle" size={24} color="#fff" />
                  <Text style={styles.joinButtonText}>{status.text}</Text>
                </>
              )}
            </TouchableOpacity>
          );
        })()}

        
      </ScrollView>
      ) : (
        <LessonsTab lessons={lessons} classroomId={classroom.classroomId} isLoading={isLoadingLessons} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginHorizontal: 8,
  },
  headerRight: {
    width: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  mainCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  archivedBadge: {
    backgroundColor: '#FFF3CD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  archivedText: {
    fontSize: 12,
    color: '#856404',
    fontWeight: '600',
  },
  className: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 15,
    color: '#666',
    marginLeft: 12,
    flex: 1,
  },
  infoValue: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  priceText: {
    color: '#FF3B30',
    fontWeight: '600',
  },
  archivedStatusText: {
    color: '#FF9500',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 8,
  },
  enrolledBanner: {
    backgroundColor: '#E8F5E9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  enrolledText: {
    fontSize: 16,
    fontWeight: '600',
  },
  pendingBanner: {
    backgroundColor: '#FFF3CD',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  pendingText: {
    fontSize: 16,
    fontWeight: '600',
  },
  rejectedBanner: {
    backgroundColor: '#FFE5E5',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  rejectedText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  rejectedSubtext: {
    fontSize: 13,
    color: '#666',
  },
  retryButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    minWidth: 80,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  joinButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 8,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  actionSection: {
    marginTop: 8,
  },
  actionButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
