import { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../core/store/hooks';
import {
    getMessagesAsync,
    sendMessageAsync,
    clearMessages,
} from '../store/classroomChatSlice';
import { MessageCircle, Send, Image as ImageIcon, User } from 'lucide-react';
import { Spinner } from '../../../shared/components/loading/Loading';

export const ClassroomChat = ({ classroomId }) => {
    const dispatch = useAppDispatch();
    const { messages, loading, sendLoading } = useAppSelector((state) => state.classroomChat);
    const { user } = useAppSelector((state) => state.auth);
    const [messageContent, setMessageContent] = useState('');
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

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
        return message.senderId === user?.userId;
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
        <div className="flex flex-col h-[600px] bg-background border border-border rounded-sm">
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
                                        
                                        <div
                                            className={`px-3 py-2 rounded-sm ${
                                                isOwn
                                                    ? 'bg-foreground text-white'
                                                    : 'bg-gray-100 text-foreground'
                                            }`}
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
                            className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:border-foreground bg-background resize-none"
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
