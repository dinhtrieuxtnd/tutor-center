import { useState } from 'react';
import { BookOpen, ChevronRight, ChevronDown, File, Play } from 'lucide-react';

export const LectureItem = ({ lecture, level = 0, onView }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasChildren = lecture.children && lecture.children.length > 0;

    const indentClass = level > 0 ? `ml-${level * 4}` : '';

    return (
        <div className="border-b border-border last:border-b-0">
            <div
                className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${indentClass}`}
                style={{ paddingLeft: `${level * 16 + 16}px` }}
            >
                {/* Expand/Collapse button for parent lectures */}
                {hasChildren ? (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-sm text-foreground-light"
                    >
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                ) : (
                    <div className="w-6 flex-shrink-0" />
                )}

                {/* Lecture icon */}
                <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-sm flex items-center justify-center">
                    {lecture.mediaUrl ? (
                        <Play size={18} className="text-blue-600" />
                    ) : (
                        <BookOpen size={18} className="text-blue-600" />
                    )}
                </div>

                {/* Lecture content */}
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-foreground mb-1">
                        {lecture.title}
                    </h4>
                    {lecture.content && (
                        <p className="text-xs text-foreground-light line-clamp-2 mb-2">
                            {lecture.content}
                        </p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-foreground-lighter">
                        {lecture.mediaUrl && (
                            <span className="flex items-center gap-1">
                                <File size={12} />
                                Có file đính kèm
                            </span>
                        )}
                        <span>
                            Cập nhật: {new Date(lecture.updatedAt).toLocaleDateString('vi-VN')}
                        </span>
                    </div>
                </div>

                {/* Action button */}
                <button 
                    onClick={() => onView && onView(lecture)}
                    className="flex-shrink-0 px-3 py-1.5 text-xs font-medium text-foreground border border-border rounded-sm hover:bg-gray-50 transition-colors"
                >
                    Xem chi tiết
                </button>
            </div>

            {/* Nested children */}
            {hasChildren && isExpanded && (
                <div className="bg-gray-50">
                    {lecture.children.map((child, index) => (
                        <LectureItem key={child.id || index} lecture={child} level={level + 1} onView={onView} />
                    ))}
                </div>
            )}
        </div>
    );
};
