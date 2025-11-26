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
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { 
  classroomService, 
  ClassroomResponse,
  ClassroomQueryRequest 
} from '../../services/classroomService';
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
      };
      
      if (searchQuery.trim()) {
        params.q = searchQuery.trim();
      }
      
      const response = await classroomService.query(params);
      setAllClassrooms(response.items);
      setTotalClassrooms(response.total);
      setCurrentPage(page);
    } catch (error: any) {
      console.error('Error fetching all classrooms:', error);
      Alert.alert('Lỗi', error.message || 'Không thể tải danh sách lớp học');
    } finally {
      setIsLoadingAll(false);
    }
  }, [searchQuery, pageSize]);

  const fetchEnrolledClassrooms = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) {
        setIsLoadingEnrolled(true);
      }
      const data = await classroomService.getMyEnrollments();
      setEnrolledClassrooms(data);
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

  const handleClassroomPress = (classroom: ClassroomResponse) => {
    router.push({
      pathname: '/classroom-detail',
      params: { id: classroom.classroomId.toString() },
    });
  };

  const handleLoadMore = () => {
    if (!isLoadingAll && allClassrooms.length < totalClassrooms) {
      fetchAllClassrooms(false, currentPage + 1);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const isEnrolled = (classroomId: number) => {
    return enrolledClassrooms.some(c => c.classroomId === classroomId);
  };

  const renderClassroomItem = ({ item }: { item: ClassroomResponse }) => {
    const enrolled = isEnrolled(item.classroomId);
    
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
            {enrolled && (
              <View style={styles.enrolledBadge}>
                <Ionicons name="checkmark-circle" size={14} color="#34C759" />
                <Text style={styles.enrolledText}>Đã tham gia</Text>
              </View>
            )}
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
            <Text style={styles.infoText}>GV: {item.tutorName}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="people" size={16} color="#666" />
            <Text style={styles.infoText}>{item.studentCount} học sinh</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="cash" size={16} color="#666" />
            <Text style={styles.infoText}>{formatPrice(item.price)}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Ionicons name="chevron-forward" size={20} color="#007AFF" />
        </View>
      </TouchableOpacity>
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
        keyExtractor={(item) => item.classroomId.toString()}
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
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
