import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  classroomService,
  ClassroomResponse,
  ClassroomQueryRequest
} from '../../services/classroomService';
import { paymentService, PaymentResponse } from '../../services/paymentService';
import { joinRequestService, JoinRequestResponse } from '../../services/joinRequestService';
import { useAuth } from '../../contexts/AuthContext';

type TabType = 'enrolled' | 'all';

export default function ClassroomsScreen() {
  const router = useRouter();
  const { user } = useAuth();

  // Tab state
  const [activeTab, setActiveTab] = useState<TabType>('enrolled');

  // All classrooms data
  const [allClassrooms, setAllClassrooms] = useState<ClassroomResponse[]>([]);
  const [totalClassrooms, setTotalClassrooms] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);

  // Enrolled classrooms data
  const [enrolledClassrooms, setEnrolledClassrooms] = useState<ClassroomResponse[]>([]);

  // Payment data for status checking
  const [payments, setPayments] = useState<PaymentResponse[]>([]);

  // Join request data for pending status
  const [joinRequests, setJoinRequests] = useState<JoinRequestResponse[]>([]);

  // UI states
  const [isLoadingAll, setIsLoadingAll] = useState(true);
  const [isLoadingEnrolled, setIsLoadingEnrolled] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const fetchAllClassrooms = useCallback(async (showLoader = true, page = 1) => {
    try {
      if (showLoader) {
        setIsLoadingAll(true);
      }

      const params: ClassroomQueryRequest = {
        page,
        pageSize,
        isArchived: false,
        includeDeleted: false, // Don't show deleted classrooms
      };

      if (searchQuery.trim()) {
        params.q = searchQuery.trim();
      }

      const response = await classroomService.query(params);
      console.log('📚 All classrooms response:', JSON.stringify(response, null, 2));
      
      // Don't modify hasPaid - payment API doesn't have classroomId
      // Backend should return correct hasPaid status
      
      setAllClassrooms(response.items);
      setTotalClassrooms(response.total);
      setCurrentPage(page);
    } catch (error: any) {
      console.error('Error fetching all classrooms:', error);
      Alert.alert('Lỗi', error.message || 'Không thể tải danh sách lớp học');
    } finally {
      setIsLoadingAll(false);
    }
  }, [searchQuery, pageSize, payments]);

  const fetchEnrolledClassrooms = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) {
        setIsLoadingEnrolled(true);
      }
      // Fetch enrollments, payments, and join requests in parallel
      const [enrolledData, paymentsData, joinRequestsData] = await Promise.all([
        classroomService.getMyEnrollments(),
        paymentService.getMyPayments(),
        joinRequestService.getMy()
      ]);
      
      console.log('📚 Enrolled classrooms:', JSON.stringify(enrolledData, null, 2));
      console.log('💰 Payments loaded:', paymentsData.length);
      console.log('💰 Payments detail:', JSON.stringify(paymentsData, null, 2));
      console.log('📩 Join requests loaded:', joinRequestsData.length);
      console.log('📩 Join requests detail:', JSON.stringify(joinRequestsData, null, 2));
      
      // NOTE: Payment API doesn't return classroomId, so we can't map payments to specific classrooms
      // We rely on backend's hasPaid field in ClassroomStudents instead
      // Don't modify hasPaid here - use what backend returns
      
      setEnrolledClassrooms(enrolledData);
      setPayments(paymentsData);
      setJoinRequests(joinRequestsData);
    } catch (error: any) {
      console.error('Error fetching enrolled classrooms:', error);
      Alert.alert('Lỗi', error.message || 'Không thể tải lớp học đã tham gia');
    } finally {
      setIsLoadingEnrolled(false);
    }
  }, []);

  const fetchAllData = useCallback(async (showLoader = true) => {
    await Promise.all([
      fetchAllClassrooms(showLoader),
      fetchEnrolledClassrooms(showLoader),
    ]);
    setIsRefreshing(false);
  }, [fetchAllClassrooms, fetchEnrolledClassrooms]);

  useEffect(() => {
    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refresh data when screen comes into focus (e.g., after creating join request)
  useFocusEffect(
    useCallback(() => {
      console.log('🔄 ClassroomsScreen focused - refreshing data');
      fetchEnrolledClassrooms(false);
      fetchAllClassrooms(false, currentPage);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery !== undefined) {
        fetchAllClassrooms(true, 1);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setCurrentPage(1);
    fetchAllData(false);
  }, [fetchAllData]);

  const getClassroomId = (classroom: ClassroomResponse): number | undefined => {
    return classroom.id || classroom.classroomId;
  };

  const handleClassroomPress = (classroom: ClassroomResponse) => {
    const id = getClassroomId(classroom);
    if (!id) {
      console.warn('⚠️ Invalid classroom data:', classroom);
      return;
    }
    router.push({
      pathname: '/classroom-detail',
      params: { id: id.toString() },
    });
  };

  const handleLoadMore = () => {
    if (!isLoadingAll && allClassrooms.length < totalClassrooms) {
      fetchAllClassrooms(false, currentPage + 1);
    }
  };

  const handleJoinClassroom = async (classroom: ClassroomResponse) => {
    const classroomId = getClassroomId(classroom);
    if (!classroomId) return;

    try {
      // Navigate to classroom detail where user can join
      router.push({
        pathname: '/classroom-detail',
        params: { id: classroomId.toString() },
      });
    } catch (error: any) {
      console.error('Error navigating to classroom:', error);
      Alert.alert('Lỗi', 'Không thể mở chi tiết lớp học');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const isEnrolled = (classroomId: number) => {
    return enrolledClassrooms.some(c => getClassroomId(c) === classroomId);
  };

  const hasJoinRequest = (classroomId: number) => {
    const hasPending = joinRequests.some(jr => {
      const jrClassroomId = jr.classroomId || jr.classRoomId; // Backend uses classRoomId with capital R
      const jrStatus = jr.status.toLowerCase(); // Normalize status to lowercase
      const match = jrClassroomId === classroomId && jrStatus === 'pending';
      console.log(`🔍 Check JR: classroomId=${jrClassroomId}, status=${jrStatus}, match=${match}`);
      return match;
    });
    console.log(`🎯 Classroom ${classroomId} has pending request: ${hasPending}`);
    return hasPending;
  };

  const renderClassroomItem = ({ item }: { item: ClassroomResponse }) => {
    const classroomId = getClassroomId(item);
    const enrolled = classroomId ? isEnrolled(classroomId) : false;
    const hasPendingRequest = classroomId ? hasJoinRequest(classroomId) : false;
    const tutorName = item.tutorName || item.tutor?.fullName || 'Unknown';

    return (
      <TouchableOpacity
        style={styles.classroomCard}
        onPress={() => handleClassroomPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <Ionicons name="school" size={24} color="#007AFF" />
          </View>
          <View style={styles.headerContent}>
            <Text style={styles.className} numberOfLines={2}>
              {item.name}
            </Text>
          </View>
        </View>

        {item.description && (
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        )}

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="person" size={16} color="#666" />
            <Text style={styles.infoText}>
              GV: {item.tutorName || item.tutor?.fullName || 'Chưa có thông tin'}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="cash" size={16} color="#666" />
            <Text style={styles.infoText}>{formatPrice(item.price)}</Text>
          </View>
        </View>

        {/* Enrollment Status Badge and Join Button */}
        <View style={styles.footer}>
          {enrolled ? (
            <>
              <View style={styles.enrolledStatusBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#34C759" />
                <Text style={styles.enrolledStatusText}>Đã tham gia</Text>
              </View>
              {item.hasPaid === true ? (
                <View style={styles.paidStatusBadge}>
                  <Ionicons name="checkmark-circle" size={16} color="#34C759" />
                  <Text style={styles.paidStatusText}>Đã thanh toán</Text>
                </View>
              ) : (
                <View style={styles.unpaidStatusBadge}>
                  <Ionicons name="alert-circle" size={16} color="#FF3B30" />
                  <Text style={styles.unpaidStatusText}>Chưa thanh toán</Text>
                </View>
              )}
            </>
          ) : (
            <>
              {hasPendingRequest ? (
                <View style={styles.pendingRequestBadge}>
                  <Ionicons name="time" size={16} color="#FF9500" />
                  <Text style={styles.pendingRequestText}>Đã gửi yêu cầu</Text>
                </View>
              ) : (
                <>
                  <View style={styles.notEnrolledBadge}>
                    <Ionicons name="alert-circle" size={16} color="#FF9500" />
                    <Text style={styles.notEnrolledText}>Chưa tham gia</Text>
                  </View>
                  {/* Only show join button in 'all' tab, not in 'enrolled' tab */}
                  {activeTab === 'all' && (
                    <TouchableOpacity
                      style={styles.joinClassButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleJoinClassroom(item);
                      }}
                    >
                      <Ionicons name="add-circle" size={16} color="#fff" />
                      <Text style={styles.joinClassButtonText}>Tham gia</Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </>
          )}
        </View>
      </TouchableOpacity >
    );
  };

  const renderEmptyComponent = () => {
    const isEnrolledTab = activeTab === 'enrolled';
    return (
      <View style={styles.emptyContainer}>
        <Ionicons
          name={isEnrolledTab ? 'school-outline' : 'search-outline'}
          size={80}
          color="#ccc"
        />
        <Text style={styles.emptyTitle}>
          {isEnrolledTab ? 'Chưa tham gia lớp học nào' : 'Không tìm thấy lớp học'}
        </Text>
        <Text style={styles.emptyText}>
          {isEnrolledTab
            ? 'Khám phá và đăng ký lớp học phù hợp với bạn'
            : 'Thử tìm kiếm với từ khóa khác'}
        </Text>
      </View>
    );
  };

  const currentData = activeTab === 'enrolled' ? enrolledClassrooms : allClassrooms;
  const isLoading = activeTab === 'enrolled' ? isLoadingEnrolled : isLoadingAll;

  if (isLoadingAll && isLoadingEnrolled && !isRefreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Đang tải danh sách lớp học...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Lớp học</Text>
          {activeTab === 'all' && (
            <TouchableOpacity
              onPress={() => setShowSearch(!showSearch)}
              style={styles.searchButton}
            >
              <Ionicons
                name={showSearch ? 'close' : 'search'}
                size={24}
                color="#333"
              />
            </TouchableOpacity>
          )}
        </View>

        {showSearch && activeTab === 'all' && (
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm lớp học..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                style={styles.clearButton}
              >
                <Ionicons name="close-circle" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'enrolled' && styles.activeTab]}
            onPress={() => {
              setActiveTab('enrolled');
              setShowSearch(false);
              setSearchQuery('');
            }}
          >
            <Text style={[styles.tabText, activeTab === 'enrolled' && styles.activeTabText]}>
              Lớp của tôi ({enrolledClassrooms.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'all' && styles.activeTab]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
              Tất cả ({totalClassrooms})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={currentData}
        renderItem={renderClassroomItem}
        keyExtractor={(item, index) => {
          const id = getClassroomId(item);
          return id?.toString() || `classroom-${index}`;
        }}
        contentContainerStyle={[
          styles.listContent,
          currentData.length === 0 && styles.emptyListContent,
        ]}
        ListEmptyComponent={renderEmptyComponent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#007AFF']}
            tintColor="#007AFF"
          />
        }
        onEndReached={activeTab === 'all' ? handleLoadMore : undefined}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoadingAll && allClassrooms.length > 0 && activeTab === 'all' ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color="#007AFF" />
            </View>
          ) : null
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  searchButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  listContent: {
    padding: 16,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  classroomCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  className: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  enrolledBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 4,
  },
  enrolledText: {
    fontSize: 12,
    color: '#34C759',
    fontWeight: '500',
    marginLeft: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  unpaidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 4,
  },
  unpaidText: {
    fontSize: 12,
    color: '#FF3B30',
    fontWeight: '500',
    marginLeft: 4,
  },
  unpaidStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  unpaidStatusText: {
    fontSize: 12,
    color: '#FF3B30',
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 8,
  },
  enrolledStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  enrolledStatusText: {
    fontSize: 12,
    color: '#34C759',
    fontWeight: '600',
  },
  paidStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  paidStatusText: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '600',
  },
  notEnrolledBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  notEnrolledText: {
    fontSize: 12,
    color: '#FF9500',
    fontWeight: '600',
  },
  pendingRequestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  pendingRequestText: {
    fontSize: 12,
    color: '#FF9500',
    fontWeight: '600',
  },
  joinClassButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  joinClassButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
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
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
});
