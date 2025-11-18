import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen,
    Calendar,
    ChevronDown,
    ChevronRight,
    FileText,
    User
} from 'lucide-react';
import { LessonResponse } from '@/services/lessonApi';
import { LectureResponse } from '@/services/lectureApi';

interface LectureCardProps {
    lesson: LessonResponse;
}

export function LectureCard({ lesson }: LectureCardProps) {
    const router = useRouter();
    const [isExpanded, setIsExpanded] = useState(false);

    if (!lesson.lecture) return null;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const hasChildren = lesson.lecture.children && lesson.lecture.children.length > 0;

    const handleParentClick = () => {
        if (hasChildren) {
            setIsExpanded(!isExpanded);
        }
    };

    const handleChildClick = (e: React.MouseEvent, lectureId: number) => {
        e.stopPropagation();
    };

    return (
        <div className="rounded-lg overflow-hidden transition-colors">
            {/* Parent Lecture */}
            <div
                onClick={handleParentClick}
                className={`flex items-start gap-4 p-4 bg-white transition-all rounded-t-lg ${isExpanded ? 'border border-blue-300' : 'border border-transparent'} cursor-pointer ${hasChildren ? 'hover:bg-gray-50' : 'hover:bg-gray-50'
                    }`}
            >
                <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6" />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4 mb-2">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 font-poppins truncate">
                                {lesson.lecture.title}
                            </h3>
                            <span className="text-xs px-2 py-1 rounded-full font-open-sans bg-blue-100 text-blue-800 whitespace-nowrap">
                                Bài giảng
                            </span>
                            {hasChildren && (
                                <span className="text-xs px-2 py-1 rounded-full font-open-sans bg-gray-100 text-gray-600 whitespace-nowrap">
                                    {lesson.lecture.children.length} bài học
                                </span>
                            )}
                        </div>

                        {hasChildren && (
                            <motion.div
                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                                className="flex-shrink-0"
                            >
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                            </motion.div>
                        )}
                    </div>

                    {lesson.lecture.content && (
                        <p className="text-sm text-gray-600 font-open-sans mb-2 line-clamp-2">
                            {lesson.lecture.content}
                        </p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-gray-500 font-open-sans">
                        <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(lesson.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {lesson.lecture.uploadedByName}
                        </span>
                    </div>
                </div>
            </div>

            {/* Children Lectures */}
            <AnimatePresence>
                {isExpanded && hasChildren && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="bg-gray-50 border-t border-gray-200">
                            {lesson.lecture.children.map((child, index) => (
                                <motion.div
                                    key={child.lectureId}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.05, duration: 0.2 }}
                                    onClick={(e) => handleChildClick(e, child.lectureId)}
                                    className="flex items-start gap-3 p-4 pl-8 hover:bg-gray-100 transition-colors cursor-pointer border-b border-gray-100 last:border-b-0"
                                >
                                    <ChevronRight className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />

                                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0">
                                        <FileText className="w-5 h-5" />
                                    </div>

                                    <div className="flex flex-row items-start justify-between gap-6 w-full">

                                        {/* Left side: Title + Content */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-gray-800 font-poppins mb-1 truncate">
                                                {child.title}
                                            </h4>

                                            {child.content && (
                                                <p className="text-sm text-gray-600 font-open-sans mb-1 line-clamp-2">
                                                    {child.content}
                                                </p>
                                            )}
                                        </div>

                                        {/* Right side: Meta Info */}
                                        <div className="flex flex-col items-end text-xs text-gray-500 font-open-sans min-w-[140px]">

                                            {/* Date */}
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {formatDate(child.uploadedAt)}
                                            </span>

                                            {/* Attachment */}
                                            {child.mediaId && (
                                                <span className="flex items-center gap-1 text-blue-600 mt-1">
                                                    <FileText className="w-3 h-3" />
                                                    Có tài liệu đính kèm
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
