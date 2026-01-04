import React, { useEffect, useState, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Platform,
    KeyboardAvoidingView,
    RefreshControl,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { chatService, ChatMessageResponse } from '../services/chatService';

export default function ClassroomChatScreen() {
    const { classroomId, classroomName } = useLocalSearchParams<{
        classroomId: string;
        classroomName: string;
    }>();
    const router = useRouter();

    const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [messageText, setMessageText] = useState('');
    const [editingMessage, setEditingMessage] = useState<ChatMessageResponse | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const scrollViewRef = useRef<ScrollView>(null);

    // Load messages
    const loadMessages = async (page: number = 1, append: boolean = false) => {
        try {
            if (!append) setIsLoading(true);

            const result = await chatService.getMessages({
                classroomId: Number(classroomId),
                page,
                pageSize: 20,
            });

            if (append) {
                setMessages(prev => [...prev, ...result.items]);
            } else {
                setMessages(result.items);
            }

            setHasMore(result.items.length === 20);
            setCurrentPage(page);
        } catch (error: any) {
            console.error('Error loading messages:', error);
            Alert.alert('Lỗi', error.message || 'Không thể tải tin nhắn');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        loadMessages();
    }, [classroomId]);

    const handleRefresh = () => {
        setIsRefreshing(true);
        loadMessages(1, false);
    };

    const handleLoadMore = () => {
        if (!isLoading && hasMore) {
            loadMessages(currentPage + 1, true);
        }
    };

    const handleSendMessage = async () => {
        if (!messageText.trim()) return;

        const textToSend = messageText.trim();
        setMessageText('');

        try {
            setIsSending(true);

            if (editingMessage) {
                // Edit existing message
                const updatedMessage = await chatService.editMessage({
                    messageId: editingMessage.messageId,
                    content: textToSend,
                });

                setMessages(prev =>
                    prev.map(msg =>
                        msg.messageId === updatedMessage.messageId ? updatedMessage : msg
                    )
                );
                setEditingMessage(null);
            } else {
                // Send new message
                const newMessage = await chatService.sendMessage({
                    classroomId: Number(classroomId),
                    content: textToSend,
                });

                setMessages(prev => [newMessage, ...prev]);

                // Scroll to bottom
                setTimeout(() => {
                    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
                }, 100);
            }
        } catch (error: any) {
            console.error('Error sending message:', error);
            Alert.alert('Lỗi', error.message || 'Không thể gửi tin nhắn');
            setMessageText(textToSend); // Restore text
        } finally {
            setIsSending(false);
        }
    };

    const handleEditMessage = (message: ChatMessageResponse) => {
        setEditingMessage(message);
        setMessageText(message.content);
    };

    const handleCancelEdit = () => {
        setEditingMessage(null);
        setMessageText('');
    };

    const handleDeleteMessage = (message: ChatMessageResponse) => {
        Alert.alert(
            'Xóa tin nhắn',
            'Bạn có chắc chắn muốn xóa tin nhắn này?',
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Xóa',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await chatService.deleteMessage(message.messageId);
                            setMessages(prev => prev.filter(msg => msg.messageId !== message.messageId));
                        } catch (error: any) {
                            Alert.alert('Lỗi', error.message || 'Không thể xóa tin nhắn');
                        }
                    },
                },
            ]
        );
    };

    const formatTime = (dateString: string): string => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Vừa xong';
        if (diffMins < 60) return `${diffMins} phút trước`;

        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours} giờ trước`;

        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (isLoading && messages.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Đang tải tin nhắn...</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Chat</Text>
                    <Text style={styles.headerSubtitle}>{classroomName || 'Lớp học'}</Text>
                </View>
            </View>

            {/* Messages */}
            <ScrollView
                ref={scrollViewRef}
                style={styles.messagesContainer}
                contentContainerStyle={styles.messagesContent}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
                }
                onScroll={({ nativeEvent }) => {
                    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
                    const isCloseToBottom =
                        layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

                    if (isCloseToBottom) {
                        handleLoadMore();
                    }
                }}
                scrollEventThrottle={400}
            >
                {messages.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="chatbubbles-outline" size={64} color="#9CA3AF" />
                        <Text style={styles.emptyText}>Chưa có tin nhắn nào</Text>
                        <Text style={styles.emptySubtext}>Hãy bắt đầu cuộc trò chuyện!</Text>
                    </View>
                ) : (
                    <>
                        {messages.map((message) => (
                            <TouchableOpacity
                                key={message.messageId}
                                style={styles.messageItem}
                                onLongPress={() => {
                                    Alert.alert('Tùy chọn', 'Chọn hành động', [
                                        { text: 'Hủy', style: 'cancel' },
                                        {
                                            text: 'Chỉnh sửa',
                                            onPress: () => handleEditMessage(message),
                                        },
                                        {
                                            text: 'Xóa',
                                            style: 'destructive',
                                            onPress: () => handleDeleteMessage(message),
                                        },
                                    ]);
                                }}
                            >
                                <View style={styles.messageHeader}>
                                    <Text style={styles.senderName}>{message.senderName}</Text>
                                    <Text style={styles.messageTime}>{formatTime(message.createdAt)}</Text>
                                </View>
                                <Text style={styles.messageContent}>{message.content}</Text>
                                {message.isEdited && (
                                    <Text style={styles.editedLabel}>(đã chỉnh sửa)</Text>
                                )}
                            </TouchableOpacity>
                        ))}

                        {hasMore && (
                            <TouchableOpacity
                                style={styles.loadMoreBtn}
                                onPress={() => handleLoadMore()}
                            >
                                <Text style={styles.loadMoreText}>Tải thêm tin nhắn</Text>
                            </TouchableOpacity>
                        )}
                    </>
                )}
            </ScrollView>

            {/* Input */}
            <View style={styles.inputContainer}>
                {editingMessage && (
                    <View style={styles.editingBanner}>
                        <Text style={styles.editingText}>Đang chỉnh sửa tin nhắn</Text>
                        <TouchableOpacity onPress={handleCancelEdit}>
                            <Ionicons name="close-circle" size={20} color="#6B7280" />
                        </TouchableOpacity>
                    </View>
                )}

                <View style={styles.inputRow}>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập tin nhắn..."
                        value={messageText}
                        onChangeText={setMessageText}
                        multiline
                        maxLength={1000}
                    />
                    <TouchableOpacity
                        style={[styles.sendBtn, (!messageText.trim() || isSending) && styles.sendBtnDisabled]}
                        onPress={handleSendMessage}
                        disabled={!messageText.trim() || isSending}
                    >
                        {isSending ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <Ionicons name="send" size={20} color="white" />
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
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
    headerSubtitle: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 14,
        marginTop: 2,
    },
    messagesContainer: {
        flex: 1,
    },
    messagesContent: {
        padding: 16,
        flexDirection: 'column-reverse',
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
    },
    messageItem: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
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
    messageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    senderName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#007AFF',
    },
    messageTime: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    messageContent: {
        fontSize: 15,
        lineHeight: 22,
        color: '#1F2937',
    },
    editedLabel: {
        fontSize: 12,
        color: '#9CA3AF',
        fontStyle: 'italic',
        marginTop: 4,
    },
    loadMoreBtn: {
        alignSelf: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginTop: 8,
    },
    loadMoreText: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '500',
    },
    inputContainer: {
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    editingBanner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#FEF3C7',
    },
    editingText: {
        fontSize: 14,
        color: '#92400E',
        fontWeight: '500',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: 12,
        gap: 8,
    },
    input: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 15,
        maxHeight: 100,
    },
    sendBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendBtnDisabled: {
        backgroundColor: '#9CA3AF',
    },
});
