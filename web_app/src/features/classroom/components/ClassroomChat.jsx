import { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../core/store/hooks';
import {
    getMessagesAsync,
    sendMessageAsync,
    editMessageAsync,
    deleteMessageAsync,
    clearMessages,
} from '../store/classroomChatSlice';
import { MessageCircle, Send, Image as ImageIcon, User, Edit2, Trash2, X, Check } from 'lucide-react';
import { Spinner } from '../../../shared/components/loading/Loading';

export const ClassroomChat = ({ classroomId }) => {
    const dispatch = useAppDispatch();
    const { messages, loading, sendLoading, editLoading, deleteLoading } = useAppSelector((state) => state.classroomChat);
    const { profile } = useAppSelector((state) => state.profile);
    const [messageContent, setMessageContent] = useState('');
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [deletingMessageId, setDeletingMessageId] = useState(null);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const editInputRef = useRef(null);

    useEffect(() => {
        if (classroomId) {
            dispatch(clearMessages());
            dispatch(
                getMessagesAsync({
                    classroomId,
                    pageNumber: 1,
                    pageSize: 50,
                })
            );
        }
    }, [classroomId, dispatch]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageContent.trim() || sendLoading) return;

        const result = await dispatch(
            sendMessageAsync({
                classroomId,
                content: messageContent.trim(),
                mediaIds: [],
            })
        );

        if (result.type.endsWith('/fulfilled')) {
            setMessageContent('');
            inputRef.current?.focus();
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return date.toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
            });
        }

        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const isOwnMessage = (message) => {
        return message.senderId == profile?.userId;
    };

    const handleStartEdit = (message) => {
        setEditingMessageId(message.messageId);
        setEditContent(message.content);
        setTimeout(() => editInputRef.current?.focus(), 0);
    };

    const handleCancelEdit = () => {
        setEditingMessageId(null);
        setEditContent('');
    };

    const handleSaveEdit = async (messageId) => {
        if (!editContent.trim() || editLoading) return;

        const result = await dispatch(
            editMessageAsync({
                messageId,
                content: editContent.trim(),
                mediaIds: [],
            })
        );

        if (result.type.endsWith('/fulfilled')) {
            setEditingMessageId(null);
            setEditContent('');
        }
    };

    const handleDeleteMessage = async (messageId) => {
        if (deleteLoading) return;

        setDeletingMessageId(messageId);
        const result = await dispatch(deleteMessageAsync(messageId));

        if (result.type.endsWith('/fulfilled')) {
            // Remove message from UI
            setDeletingMessageId(null);
        } else {
            setDeletingMessageId(null);
        }
    };

    /* ================= LOADING ================= */
    if (loading && messages.length === 0) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <Spinner size="lg" className="mx-auto mb-2" />
                    <p className="text-sm text-foreground-light">Đang tải tin nhắn...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[600px] bg-primary border border-border rounded-sm">
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-gray-50">
                <MessageCircle size={18} className="text-foreground" />
                <h3 className="text-base font-semibold text-foreground">
                    Phòng chat
                    <span className="ml-2 text-sm font-normal text-foreground-light">
                        ({messages.length} tin nhắn)
                    </span>
                </h3>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <MessageCircle size={48} className="text-gray-300 mx-auto mb-3" />
                            <p className="text-sm text-foreground-light">
                                Chưa có tin nhắn nào
                            </p>
                            <p className="text-xs text-foreground-lighter mt-1">
                                Hãy bắt đầu cuộc trò chuyện
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        {messages.map((message) => {
                            const isOwn = isOwnMessage(message);
                            return (
                                <div
                                    key={message.messageId}
                                    className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
                                >
                                    {/* Avatar */}
                                    {!isOwn && (
                                        <div className="flex-shrink-0">
                                            {message.senderAvatarUrl ? (
                                                <img
                                                    src={message.senderAvatarUrl}
                                                    alt={message.senderName}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                                    <User size={16} className="text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Message Content */}
                                    <div className={`flex flex-col max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
                                        {!isOwn && (
                                            <span className="text-xs font-medium text-foreground mb-1">
                                                {message.senderName}
                                            </span>
                                        )}

                                        {/* Edit mode */}
                                        {isOwn && editingMessageId === message.messageId ? (
                                            <div className="w-full">
                                                <textarea
                                                    ref={editInputRef}
                                                    value={editContent}
                                                    onChange={(e) => setEditContent(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' && !e.shiftKey) {
                                                            e.preventDefault();
                                                            handleSaveEdit(message.messageId);
                                                        }
                                                        if (e.key === 'Escape') {
                                                            handleCancelEdit();
                                                        }
                                                    }}
                                                    className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:border-foreground bg-primary resize-none"
                                                    rows={2}
                                                    disabled={editLoading}
                                                />
                                                <div className="flex gap-2 mt-2">
                                                    <button
                                                        onClick={() => handleSaveEdit(message.messageId)}
                                                        disabled={!editContent.trim() || editLoading}
                                                        className="px-3 py-1 text-xs bg-foreground text-white rounded-sm hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                                    >
                                                        {editLoading ? <Spinner size="xs" /> : <Check size={14} />}
                                                        Lưu
                                                    </button>
                                                    <button
                                                        onClick={handleCancelEdit}
                                                        disabled={editLoading}
                                                        className="px-3 py-1 text-xs bg-gray-200 text-foreground rounded-sm hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                                    >
                                                        <X size={14} />
                                                        Hủy
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="group relative">
                                                <div
                                                    className={`px-3 py-2 rounded-sm ${isOwn
                                                        ? 'bg-foreground text-white'
                                                        : 'bg-gray-100 text-foreground'
                                                        } ${deletingMessageId === message.messageId ? 'opacity-50' : ''}`}
                                                >
                                                    <p className="text-sm break-words whitespace-pre-wrap">
                                                        {message.content}
                                                    </p>

                                                    {/* Media attachments */}
                                                    {message.media && message.media.length > 0 && (
                                                        <div className="mt-2 space-y-2">
                                                            {message.media.map((media) => (
                                                                <div key={media.mediaId}>
                                                                    {media.mediaType.startsWith('image/') ? (
                                                                        <img
                                                                            src={media.mediaUrl}
                                                                            alt="Attachment"
                                                                            className="max-w-full rounded"
                                                                        />
                                                                    ) : (
                                                                        <a
                                                                            href={media.mediaUrl}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-xs underline"
                                                                        >
                                                                            File đính kèm
                                                                        </a>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Action buttons for own messages */}
                                                {isOwn && !deletingMessageId && (
                                                    <div className="absolute -bottom-6 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white rounded-sm shadow-sm border border-gray-200 p-1">
                                                        <button
                                                            onClick={() => handleStartEdit(message)}
                                                            className="p-1.5 hover:bg-gray-100 rounded-sm text-gray-600 hover:text-foreground transition-colors"
                                                            title="Chỉnh sửa"
                                                        >
                                                            <Edit2 size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteMessage(message.messageId)}
                                                            className="p-1.5 hover:bg-red-50 rounded-sm text-gray-600 hover:text-red-600 transition-colors"
                                                            title="Xóa"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <span className="text-xs text-foreground-lighter mt-1">
                                            {formatTime(message.sentAt)}
                                            {message.isEdited && ' (đã chỉnh sửa)'}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-border bg-gray-50">
                <div className="flex items-end gap-2">
                    <button
                        type="button"
                        className="p-2 hover:bg-gray-200 rounded-sm text-foreground-light hover:text-foreground transition-colors"
                        title="Đính kèm hình ảnh"
                    >
                        <ImageIcon size={20} />
                    </button>

                    <div className="flex-1 relative">
                        <textarea
                            ref={inputRef}
                            value={messageContent}
                            onChange={(e) => setMessageContent(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage(e);
                                }
                            }}
                            placeholder="Nhập tin nhắn... (Enter để gửi, Shift+Enter để xuống dòng)"
                            rows={1}
                            className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:border-foreground bg-primary resize-none"
                            disabled={sendLoading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!messageContent.trim() || sendLoading}
                        className="px-4 py-2 bg-foreground text-white text-sm font-medium rounded-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {sendLoading ? (
                            <Spinner size="sm" />
                        ) : (
                            <>
                                <Send size={16} />
                                Gửi
                            </>
                        )}
                    </button>
                </div>
                <p className="text-xs text-foreground-lighter mt-2">
                    Nhấn Enter để gửi, Shift+Enter để xuống dòng
                </p>
            </form>
        </div>
    );
};
