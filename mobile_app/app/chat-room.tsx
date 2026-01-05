import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert,
    ActionSheetIOS,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { chatService, ChatMessageResponse } from '../services/chatService';

export default function ChatRoomScreen() {
    const { classroomId, classroomName } = useLocalSearchParams<{
        classroomId: string;
        classroomName: string;
    }>();
    const { user } = useAuth();

    const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
    const [messageText, setMessageText] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    const fetchMessages = useCallback(async () => {
        if (!classroomId) return;

        try {
            setIsLoading(true);
            const response = await chatService.getMessages({
                classroomId: parseInt(classroomId),
                page: 1,
                pageSize: 100,
            });

            // Sort messages by date (newest at bottom)
            const sortedMessages = response.items.sort(
                (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
            );

            setMessages(sortedMessages);

            // Scroll to bottom after loading
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: false });
            }, 100);
        } catch (error: any) {
            console.error('Error fetching messages:', error);
            Alert.alert('Lỗi', error.message || 'Không thể tải tin nhắn');
        } finally {
            setIsLoading(false);
        }
    }, [classroomId]);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    const handleSendMessage = async () => {
        if (!messageText.trim() || !classroomId || isSending) return;

        const textToSend = messageText.trim();
        setMessageText('');
        setIsSending(true);

        try {
            const newMessage = await chatService.sendMessage({
                classroomId: parseInt(classroomId),
                content: textToSend,
            });

            setMessages(prev => [...prev, newMessage]);

            // Scroll to bottom
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        } catch (error: any) {
            console.error('Error sending message:', error);
            Alert.alert('Lỗi', error.message || 'Không thể gửi tin nhắn');
            setMessageText(textToSend); // Restore message text on error
        } finally {
            setIsSending(false);
        }
    };

    const handleEditMessage = async (messageId: number, currentContent: string) => {
        Alert.prompt(
            'Sửa tin nhắn',
            'Nhập nội dung mới:',
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Lưu',
                    onPress: async (newContent) => {
                        if (!newContent || newContent.trim() === currentContent) return;

                        try {
                            await chatService.editMessage({
                                messageId,
                                content: newContent.trim(),
                            });

                            // Update local state
                            setMessages(prev =>
                                prev.map(msg =>
                                    msg.messageId === messageId
                                        ? { ...msg, content: newContent.trim(), isEdited: true }
                                        : msg
                                )
                            );

                            Alert.alert('Thành công', 'Đã sửa tin nhắn');
                        } catch (error: any) {
                            console.error('Error editing message:', error);
                            Alert.alert('Lỗi', error.message || 'Không thể sửa tin nhắn');
                        }
                    },
                },
            ],
            'plain-text',
            currentContent
        );
    };

    const handleDeleteMessage = async (messageId: number) => {
        Alert.alert(
            'Xóa tin nhắn',
            'Bạn có chắc muốn xóa tin nhắn này?',
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Xóa',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await chatService.deleteMessage(messageId);

                            // Remove from local state
                            setMessages(prev => prev.filter(msg => msg.messageId !== messageId));

                            Alert.alert('Thành công', 'Đã xóa tin nhắn');
                        } catch (error: any) {
                            console.error('Error deleting message:', error);
                            Alert.alert('Lỗi', error.message || 'Không thể xóa tin nhắn');
                        }
                    },
                },
            ]
        );
    };

    const handleMessageLongPress = (message: ChatMessageResponse) => {
        if (message.senderId !== user?.userId) return;

        if (Platform.OS === 'ios') {
            ActionSheetIOS.showActionSheetWithOptions(
                {
                    options: ['Hủy', 'Sửa', 'Xóa'],
                    destructiveButtonIndex: 2,
                    cancelButtonIndex: 0,
                },
                buttonIndex => {
                    if (buttonIndex === 1) {
                        handleEditMessage(message.messageId, message.content);
                    } else if (buttonIndex === 2) {
                        handleDeleteMessage(message.messageId);
                    }
                }
            );
        } else {
            Alert.alert(
                'Tùy chọn',
                'Chọn hành động:',
                [
                    { text: 'Hủy', style: 'cancel' },
                    {
                        text: 'Sửa',
                        onPress: () => handleEditMessage(message.messageId, message.content),
                    },
                    {
                        text: 'Xóa',
                        style: 'destructive',
                        onPress: () => handleDeleteMessage(message.messageId),
                    },
                ]
            );
        }
    };

    const formatTime = (dateString: string) => {
        if (!dateString) return '';

        const date = new Date(dateString);

        // Check if date is valid
        if (isNaN(date.getTime())) {
            return '';
        }

        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const renderMessage = ({ item }: { item: ChatMessageResponse }) => {
        const isOwnMessage = item.senderId === user?.userId;

        return (
            <TouchableOpacity
                style={[
                    styles.messageContainer,
                    isOwnMessage ? styles.ownMessageContainer : styles.otherMessageContainer,
                ]}
                onLongPress={() => handleMessageLongPress(item)}
                activeOpacity={0.7}
            >
                {!isOwnMessage && (
                    <Text style={styles.senderName}>{item.senderName}</Text>
                )}
                <View
                    style={[
                        styles.messageBubble,
                        isOwnMessage ? styles.ownMessageBubble : styles.otherMessageBubble,
                    ]}
                >
                    <Text
                        style={[
                            styles.messageText,
                            isOwnMessage ? styles.ownMessageText : styles.otherMessageText,
                        ]}
                    >
                        {item.content}
                    </Text>
                    {item.isEdited && (
                        <Text style={styles.editedLabel}>(đã chỉnh sửa)</Text>
                    )}
                </View>
                <Text
                    style={[
                        styles.messageTime,
                        isOwnMessage ? styles.ownMessageTime : styles.otherMessageTime,
                    ]}
                >
                    {formatTime(item.sentAt)}
                </Text>
            </TouchableOpacity>
        );
    };

    if (isLoading) {
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
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>
                    {classroomName || 'Chat'}
                </Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Messages List */}
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={item => item.messageId.toString()}
                contentContainerStyle={styles.messagesContainer}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
            />

            {/* Input Bar */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Nhập tin nhắn..."
                    value={messageText}
                    onChangeText={setMessageText}
                    multiline
                    maxLength={1000}
                    placeholderTextColor="#999"
                />
                <TouchableOpacity
                    style={[
                        styles.sendButton,
                        (!messageText.trim() || isSending) && styles.sendButtonDisabled,
                    ]}
                    onPress={handleSendMessage}
                    disabled={!messageText.trim() || isSending}
                >
                    {isSending ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Ionicons name="send" size={20} color="#fff" />
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        backgroundColor: '#007AFF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 60,
        paddingBottom: 16,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        textAlign: 'center',
        marginHorizontal: 8,
    },
    messagesContainer: {
        padding: 16,
        paddingBottom: 8,
    },
    messageContainer: {
        marginBottom: 16,
        maxWidth: '75%',
    },
    ownMessageContainer: {
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
    },
    otherMessageContainer: {
        alignSelf: 'flex-start',
        alignItems: 'flex-start',
    },
    senderName: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
        marginLeft: 12,
    },
    messageBubble: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 18,
    },
    ownMessageBubble: {
        backgroundColor: '#007AFF',
    },
    otherMessageBubble: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 20,
    },
    ownMessageText: {
        color: '#fff',
    },
    otherMessageText: {
        color: '#333',
    },
    editedLabel: {
        fontSize: 11,
        color: '#999',
        fontStyle: 'italic',
        marginTop: 4,
    },
    messageTime: {
        fontSize: 11,
        color: '#999',
        marginTop: 4,
    },
    ownMessageTime: {
        marginRight: 12,
    },
    otherMessageTime: {
        marginLeft: 12,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: 12,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
    },
    input: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 16,
        maxHeight: 100,
        marginRight: 8,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#007AFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#ccc',
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
