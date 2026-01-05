import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TextInput,
    RefreshControl,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { classroomService, ClassroomResponse } from '../../services/classroomService';

export default function ChatScreen() {
    const [enrolledClassrooms, setEnrolledClassrooms] = useState<ClassroomResponse[]>([]);
    const [filteredClassrooms, setFilteredClassrooms] = useState<ClassroomResponse[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchEnrolledClassrooms = useCallback(async (showLoader = true) => {
        try {
            if (showLoader) {
                setIsLoading(true);
            }

            const classrooms = await classroomService.getMyEnrollments();

            // Filter out deleted classrooms
            const activeClassrooms = classrooms.filter(c => !c.deletedAt);

            setEnrolledClassrooms(activeClassrooms);
            setFilteredClassrooms(activeClassrooms);
        } catch (error: any) {
            console.error('Error fetching enrolled classrooms:', error);
            Alert.alert('Lỗi', error.message || 'Không thể tải danh sách lớp học');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchEnrolledClassrooms();
    }, [fetchEnrolledClassrooms]);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredClassrooms(enrolledClassrooms);
        } else {
            const filtered = enrolledClassrooms.filter(classroom =>
                classroom.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (classroom.tutor?.fullName || classroom.tutorName || '').toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredClassrooms(filtered);
        }
    }, [searchQuery, enrolledClassrooms]);

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchEnrolledClassrooms(false);
    };

    const handleClassroomPress = (classroom: ClassroomResponse) => {
        const classroomId = (classroom as any).id || classroom.classroomId;
        if (!classroomId) {
            Alert.alert('Lỗi', 'Không tìm thấy ID lớp học');
            return;
        }

        router.push({
            pathname: '/chat-room',
            params: {
                classroomId: classroomId.toString(),
                classroomName: classroom.name,
            },
        });
    };

    const renderClassroomItem = ({ item }: { item: ClassroomResponse }) => {
        const tutorName = item.tutor?.fullName || item.tutorName || 'Giáo viên';

        return (
            <TouchableOpacity
                style={styles.classroomCard}
                onPress={() => handleClassroomPress(item)}
                activeOpacity={0.7}
            >
                <View style={styles.classroomIcon}>
                    <Ionicons name="chatbubbles" size={24} color="#007AFF" />
                </View>

                <View style={styles.classroomInfo}>
                    <Text style={styles.classroomName} numberOfLines={1}>
                        {item.name}
                    </Text>
                    <Text style={styles.tutorName} numberOfLines={1}>
                        {tutorName}
                    </Text>
                </View>

                <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
        );
    };

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>Chưa có lớp học nào</Text>
            <Text style={styles.emptyText}>
                Tham gia lớp học để bắt đầu chat với giáo viên và bạn học
            </Text>
        </View>
    );

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Đang tải...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Chat</Text>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Tìm kiếm lớp học..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholderTextColor="#999"
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Ionicons name="close-circle" size={20} color="#999" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Classroom List */}
            <FlatList
                data={filteredClassrooms}
                renderItem={renderClassroomItem}
                keyExtractor={(item, index) =>
                    ((item as any).id || item.classroomId)?.toString() || `classroom-${index}`
                }
                contentContainerStyle={
                    filteredClassrooms.length === 0 ? styles.emptyListContainer : styles.listContainer
                }
                ListEmptyComponent={renderEmptyState}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        colors={['#007AFF']}
                        tintColor="#007AFF"
                    />
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 16,
        paddingTop: 60,
        paddingBottom: 16,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginVertical: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    listContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    emptyListContainer: {
        flexGrow: 1,
    },
    classroomCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    classroomIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#E3F2FD',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    classroomInfo: {
        flex: 1,
    },
    classroomName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    tutorName: {
        fontSize: 14,
        color: '#666',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    emptyTitle: {
        fontSize: 20,
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
});
