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
  const [enrolledClassrooms, setEnrolledClassrooms] = useState<ClassroomResponse[]>([]);
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

      console.log('📚 Enrolled classrooms data:', enrolledData);
      console.log('📚 Current classroom:', classroomData);

      setClassroom(classroomData);
      setMyRequests(requestsData);
      // Backend returns 'id', not 'classroomId'
      const enrolledIds = enrolledData.map(c => (c as any).id || (c as any).classroomId).filter(Boolean);
      console.log('📚 Enrolled IDs:', enrolledIds);
      setEnrolledClassrooms(enrolledData); // Store full objects, not just IDs
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

  // Check payment status and show alert
  useEffect(() => {
    if (!classroom || !user) return;

    const status = getEnrollmentStatus();
    if (status?.type === 'enrolled') {
      const hasPaid = (classroom as any).hasPaid;
      
      if (hasPaid === false || hasPaid === null) {
        Alert.alert(
          'Chưa thanh toán học phí',
          'Bạn chưa thanh toán học phí cho lớp học này. Vui lòng thanh toán để tiếp tục học.',
          [
            { text: 'Để sau', style: 'cancel' },
            {
              text: 'Thanh toán ngay',
              onPress: handlePayment,
            },
          ]
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classroom, user]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchClassroomDetail(false);
  };

  const handleJoinRequest = async () => {
    if (!user || !classroom) return;

    // Get classroom ID (backend returns 'id', not 'classroomId')
    const classroomId = (classroom as any).id || classroom.classroomId;
    if (!classroomId) {
      Alert.alert('Lỗi', 'Không tìm thấy ID lớp học');
      return;
    }

    console.log('🔍 Checking join requests for classroom:', classroomId);
    console.log('📋 My requests:', myRequests);

    // Check if already has pending join request for this classroom
    // Backend uses classRoomId (capital R) and may return status in uppercase
    const hasPendingRequest = myRequests.some(
      req => {
        const reqClassroomId = req.classroomId || req.classRoomId;
        const reqStatus = req.status.toLowerCase();
        return reqClassroomId === classroomId && reqStatus === 'pending';
      }
    );
    
    console.log('✅ Has pending request:', hasPendingRequest);

    if (hasPendingRequest) {
      Alert.alert('Thông báo', 'Bạn đã gửi yêu cầu tham gia lớp học này rồi. Vui lòng chờ giáo viên duyệt.');
      return;
    }

    setIsJoining(true);
    try {
      await joinRequestService.create({
        classRoomId: classroomId,
      });

      // Refresh to update UI
      await fetchClassroomDetail(false);
      
      Alert.alert(
        'Thành công', 
        'Đã gửi yêu cầu tham gia. Vui lòng chờ giáo viên duyệt.',
        [
          {
            text: 'OK',
            onPress: () => router.back() // Navigate back to refresh classrooms list
          }
        ]
      );
    } catch (error: any) {
      console.error('Error creating join request:', error);
      // Check if error message contains the duplicate request message from backend
      const errorMsg = error.message || 'Không thể gửi yêu cầu tham gia';
      if (errorMsg.includes('đã gửi yêu cầu') || errorMsg.includes('đang chờ xử lý')) {
        Alert.alert('Thông báo', errorMsg);
      } else {
        Alert.alert('Lỗi', errorMsg);
      }
    } finally {
      setIsJoining(false);
    }
  };

  const handlePayment = () => {
    if (!classroom) return;

    // Backend returns 'id', but we keep 'classroomId' for compatibility
    const classroomId = (classroom as any).id || classroom.classroomId;
    if (!classroomId) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin lớp học');
      return;
    }

    router.push({
      pathname: '/payment',
      params: {
        classroomId: classroomId.toString(),
        classroomName: classroom.name,
        price: classroom.price.toString(),
      },
    });
  };

  const getEnrollmentStatus = () => {
    if (!classroom) return null;

    // Get classroom ID (backend returns 'id', but we keep 'classroomId' for compatibility)
    const currentClassroomId = (classroom as any).id || classroom.classroomId;
    if (!currentClassroomId) return null;

    // Check if enrolled by comparing IDs
    const isEnrolled = enrolledClassrooms.some(c => {
      if (!c) return false; // Skip null/undefined items
      const enrolledId = (c as any).id || (c as any).classroomId;
      return enrolledId === currentClassroomId;
    });

    if (isEnrolled) {
      return { type: 'enrolled' as const, text: 'Đã tham gia', color: '#34C759' };
    }

    // Backend uses classRoomId (capital R) and may return uppercase status
    const pendingRequest = myRequests.find(r => {
      const rClassroomId = r.classroomId || r.classRoomId;
      const rStatus = r.status.toLowerCase();
      return rClassroomId === currentClassroomId && rStatus === 'pending';
    });
    if (pendingRequest) {
      return { type: 'pending' as const, text: 'Đang chờ duyệt', color: '#FF9500' };
    }

    const rejectedRequest = myRequests.find(r => {
      const rClassroomId = r.classroomId || r.classRoomId;
      const rStatus = r.status.toLowerCase();
      return rClassroomId === currentClassroomId && rStatus === 'rejected';
    });
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
              <Text style={styles.infoValue}>
                {classroom.tutorName || (classroom as any).tutor?.fullName || 'Chưa có thông tin'}
              </Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Thông tin lớp học</Text>

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

            // enrolled - just show status
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

            // not-enrolled - show only join request button
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
                    <Ionicons name="person-add" size={20} color="#fff" />
                    <Text style={styles.joinButtonText}>Gửi yêu cầu</Text>
                  </>
                )}
              </TouchableOpacity>
            );
          })()}


        </ScrollView>
      ) : (
        <LessonsTab lessons={lessons} classroomId={classroom.id} isLoading={isLoadingLessons} />
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
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  paymentButton: {
    flex: 1,
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  paymentStatusContainer: {
    marginTop: 16,
    gap: 12,
  },
  unpaidBanner: {
    backgroundColor: '#FFF3CD',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  unpaidText: {
    color: '#856404',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  paidBanner: {
    backgroundColor: '#D1FAE5',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#34C759',
  },
  paidText: {
    color: '#065F46',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
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
