import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { profileService, ProfileResponse, UpdateProfileRequest, ChangePasswordRequest } from '../../services/profileService';

type TabType = 'profile' | 'stats' | 'payment-history' | 'security' | 'notifications';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, refreshUserData, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Profile form
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [editForm, setEditForm] = useState({
    fullName: '',
    phoneNumber: '',
  });

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await profileService.getProfile();
      setProfile(data);
      setEditForm({
        fullName: data.fullName,
        phoneNumber: data.phoneNumber || '',
      });
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      Alert.alert('Lỗi', error.message || 'Không thể tải thông tin người dùng');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProfile();
    setRefreshing(false);
  };

  const handleSaveProfile = async () => {
    try {
      if (!editForm.fullName.trim() || !editForm.phoneNumber.trim()) {
        Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin');
        return;
      }

      setLoading(true);
      const updateData: UpdateProfileRequest = {
        fullName: editForm.fullName,
        phoneNumber: editForm.phoneNumber,
      };

      await profileService.updateProfile(updateData);
      Alert.alert('Thành công', 'Cập nhật thông tin thành công');
      await fetchProfile();
      await refreshUserData();
      setIsEditing(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      Alert.alert('Lỗi', error.message || 'Không thể cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
        Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin');
        return;
      }

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        Alert.alert('Lỗi', 'Mật khẩu mới không khớp');
        return;
      }

      if (passwordForm.newPassword.length < 6) {
        Alert.alert('Lỗi', 'Mật khẩu mới phải có ít nhất 6 ký tự');
        return;
      }

      setLoading(true);
      const changePasswordData: ChangePasswordRequest = {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmNewPassword: passwordForm.confirmPassword,
      };

      await profileService.changePassword(changePasswordData);
      Alert.alert('Thành công', 'Đổi mật khẩu thành công');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      console.error('Error changing password:', error);
      Alert.alert('Lỗi', error.message || 'Không thể đổi mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  const renderTabButton = (tab: TabType, icon: keyof typeof Ionicons.glyphMap, label: string) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
      onPress={() => {
        if (tab === 'payment-history') {
          router.push('/payment-history');
        } else {
          setActiveTab(tab);
        }
      }}
    >
      <Ionicons
        name={icon}
        size={20}
        color={activeTab === tab ? '#FFFFFF' : '#6B7280'}
      />
      <Text style={[styles.tabButtonText, activeTab === tab && styles.tabButtonTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderProfileTab = () => (
    <View style={styles.tabContent}>
      {/* Avatar Section */}
      <View style={styles.avatarSection}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profile?.fullName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <TouchableOpacity style={styles.cameraButton}>
            <Ionicons name="camera" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.avatarInfo}>
          <Text style={styles.avatarName}>{profile?.fullName}</Text>
          <Text style={styles.avatarEmail}>{profile?.email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>
              {profile?.role?.toLowerCase() === 'student' ? 'Học sinh' : profile?.role?.toLowerCase() === 'tutor' ? 'Giáo viên' : 'Quản trị viên'}
            </Text>
          </View>
        </View>
        {!isEditing && (
          <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
            <Ionicons name="pencil" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Personal Information */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Thông tin cá nhân</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>
            <Ionicons name="person-outline" size={16} /> Họ và tên
          </Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editForm.fullName}
              onChangeText={(text) => setEditForm({ ...editForm, fullName: text })}
              placeholder="Nhập họ và tên"
            />
          ) : (
            <Text style={styles.inputValue}>{profile?.fullName}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>
            <Ionicons name="mail-outline" size={16} /> Email
          </Text>
          <Text style={styles.inputValue}>{profile?.email}</Text>
          <Text style={styles.inputHint}>Email không thể thay đổi</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>
            <Ionicons name="call-outline" size={16} /> Số điện thoại
          </Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editForm.phoneNumber}
              onChangeText={(text) => setEditForm({ ...editForm, phoneNumber: text })}
              placeholder="Nhập số điện thoại"
              keyboardType="phone-pad"
            />
          ) : (
            <Text style={styles.inputValue}>{profile?.phoneNumber || 'Chưa cập nhật'}</Text>
          )}
        </View>

        {isEditing && (
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setIsEditing(false);
                setEditForm({
                  fullName: profile?.fullName || '',
                  phoneNumber: profile?.phoneNumber || '',
                });
              }}
              disabled={loading}
            >
              <Ionicons name="close" size={18} color="#6B7280" />
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveProfile}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                  <Text style={styles.saveButtonText}>Lưu</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#EF4444" />
        <Text style={styles.logoutButtonText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStatsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Thống kê hoạt động</Text>

        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: '#EFF6FF' }]}>
            <Ionicons name="book-outline" size={24} color="#3B82F6" />
            <Text style={styles.statValue}>
              {profile?.role === 'Student' ? '4' : '8'}
            </Text>
            <Text style={styles.statLabel}>
              {profile?.role === 'Student' ? 'Lớp tham gia' : 'Lớp giảng dạy'}
            </Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#F0FDF4' }]}>
            <Ionicons name="people-outline" size={24} color="#10B981" />
            <Text style={styles.statValue}>
              {profile?.role === 'Student' ? '18' : '156'}
            </Text>
            <Text style={styles.statLabel}>
              {profile?.role === 'Student' ? 'Bài tập nộp' : 'Học sinh'}
            </Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#FEF3C7' }]}>
            <Ionicons name="trophy-outline" size={24} color="#F59E0B" />
            <Text style={styles.statValue}>
              {profile?.role === 'Student' ? '8.5' : '4.8'}
            </Text>
            <Text style={styles.statLabel}>
              {profile?.role === 'Student' ? 'Điểm TB' : 'Đánh giá'}
            </Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#F5F3FF' }]}>
            <Ionicons name="ribbon-outline" size={24} color="#8B5CF6" />
            <Text style={styles.statValue}>
              {profile?.role === 'Student' ? '6' : '45'}
            </Text>
            <Text style={styles.statLabel}>
              {profile?.role === 'Student' ? 'Bài kiểm tra' : 'Bài tập tạo'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderPaymentHistoryTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Lịch sử thanh toán</Text>
        <Text style={styles.cardDescription}>
          Xem chi tiết lịch sử giao dịch và thanh toán của bạn
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('/payment-history')}
        >
          <Ionicons name="receipt-outline" size={18} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>Xem lịch sử đầy đủ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSecurityTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Đổi mật khẩu</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Mật khẩu hiện tại</Text>
          <TextInput
            style={styles.input}
            value={passwordForm.currentPassword}
            onChangeText={(text) => setPasswordForm({ ...passwordForm, currentPassword: text })}
            placeholder="Nhập mật khẩu hiện tại"
            secureTextEntry
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Mật khẩu mới</Text>
          <TextInput
            style={styles.input}
            value={passwordForm.newPassword}
            onChangeText={(text) => setPasswordForm({ ...passwordForm, newPassword: text })}
            placeholder="Nhập mật khẩu mới"
            secureTextEntry
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Xác nhận mật khẩu mới</Text>
          <TextInput
            style={styles.input}
            value={passwordForm.confirmPassword}
            onChangeText={(text) => setPasswordForm({ ...passwordForm, confirmPassword: text })}
            placeholder="Nhập lại mật khẩu mới"
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
          onPress={handleChangePassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="lock-closed-outline" size={18} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>Cập nhật mật khẩu</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderNotificationsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Cài đặt thông báo</Text>

        {[
          {
            label: profile?.role === 'Student' ? 'Thông báo bài tập mới' : 'Thông báo học sinh mới',
            description: profile?.role === 'Student' ? 'Nhận thông báo khi có bài tập mới' : 'Nhận thông báo khi có học sinh đăng ký lớp',
          },
          {
            label: profile?.role === 'Student' ? 'Thông báo điểm số' : 'Thông báo bài tập được nộp',
            description: profile?.role === 'Student' ? 'Nhận thông báo khi có điểm mới' : 'Nhận thông báo khi học sinh nộp bài tập',
          },
          {
            label: 'Thông báo tin nhắn',
            description: 'Nhận thông báo khi có tin nhắn mới',
          },
          {
            label: 'Thông báo email',
            description: 'Gửi thông báo qua email',
          },
        ].map((item, index) => (
          <View key={index} style={styles.notificationItem}>
            <View style={styles.notificationInfo}>
              <Text style={styles.notificationLabel}>{item.label}</Text>
              <Text style={styles.notificationDescription}>{item.description}</Text>
            </View>
            <TouchableOpacity style={styles.switch}>
              <View style={styles.switchThumb} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );

  if (loading && !profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hồ sơ</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
          {renderTabButton('profile', 'person-outline', 'Hồ sơ')}
          {renderTabButton('stats', 'bar-chart-outline', 'Thống kê')}
          {renderTabButton('payment-history', 'wallet-outline', 'Lịch sử thanh toán')}
          {renderTabButton('security', 'shield-checkmark-outline', 'Bảo mật')}
          
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3B82F6']} />
        }
      >
        {activeTab === 'profile' && renderProfileTab()}
        {activeTab === 'stats' && renderStatsTab()}
        {activeTab === 'payment-history' && renderPaymentHistoryTab()}
        {activeTab === 'security' && renderSecurityTab()}
        {activeTab === 'notifications' && renderNotificationsTab()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  tabsContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabs: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  tabButtonActive: {
    backgroundColor: '#3B82F6',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
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
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInfo: {
    flex: 1,
    marginLeft: 16,
  },
  avatarName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  avatarEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 6,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  inputValue: {
    fontSize: 14,
    color: '#111827',
  },
  inputHint: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 44,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
    marginTop: 8,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButton: {
    height: 44,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  notificationInfo: {
    flex: 1,
  },
  notificationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  notificationDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  switch: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#D1D5DB',
    padding: 2,
    justifyContent: 'center',
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionButtonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionButtonContent: {
    flex: 1,
  },
  actionButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  actionButtonDescription: {
    fontSize: 13,
    color: '#6B7280',
  },
});
