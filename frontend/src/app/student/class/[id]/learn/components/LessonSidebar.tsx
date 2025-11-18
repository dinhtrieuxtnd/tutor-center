import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen,
    Pencil,
    ListChecks,
    ChevronDown,
    ChevronRight,
    ChevronLeft,
    FileText,
    Calendar,
    AlarmClock,
    Clock4,
} from 'lucide-react';
import { LessonResponse } from '@/services/lessonApi';
import { LessonListSkeleton } from '@/components/loading';

interface LessonSidebarProps {
    lessons: LessonResponse[];
    isLoading: boolean;
    selectedLesson: LessonResponse | null;
    selectedLectureId: number | null;
    onLessonSelect: (lesson: LessonResponse, lectureId?: number) => void;
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
}

export function LessonSidebar({
    lessons,
    isLoading,
    selectedLesson,
    selectedLectureId,
    onLessonSelect,
    isOpen,
    setIsOpen,
}: LessonSidebarProps) {
    const [expandedLectures, setExpandedLectures] = useState<Set<number>>(new Set());

    const toggleLecture = (lessonId: number) => {
        const newExpanded = new Set(expandedLectures);
        if (newExpanded.has(lessonId)) {
            newExpanded.delete(lessonId);
        } else {
            newExpanded.add(lessonId);
        }
        setExpandedLectures(newExpanded);
    };

    const getLessonIcon = (lessonType: string) => {
        switch (lessonType) {
            case 'lecture':
                return <BookOpen className="w-5 h-5" />;
            case 'exercise':
                return <Pencil className="w-5 h-5" />;
            case 'quiz':
                return <ListChecks className="w-5 h-5" />;
            default:
                return <BookOpen className="w-5 h-5" />;
        }
    };

    const getLessonTypeColor = (lessonType: string) => {
        switch (lessonType) {
            case 'lecture':
                return 'bg-blue-100 text-blue-600';
            case 'exercise':
                return 'bg-orange-100 text-orange-600';
            case 'quiz':
                return 'bg-purple-100 text-purple-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    const getLessonTitle = (lesson: LessonResponse) => {
        if (lesson.lecture) return lesson.lecture.title;
        if (lesson.exercise) return lesson.exercise.title;
        if (lesson.quiz) return lesson.quiz.title;
        return 'Không có tiêu đề';
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
        });
    };

    const isLessonSelected = (lesson: LessonResponse, lectureId?: number) => {
        if (!selectedLesson) return false;
        if (lesson.lessonId !== selectedLesson.lessonId) return false;
        if (lectureId) return selectedLectureId === lectureId;
        return !selectedLectureId;
    };

    return (
        <motion.div
            initial={false}
            animate={{ width: isOpen ? 330 : 80 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="bg-white overflow-y-auto flex-shrink-0 relative overflow-x-hidden h-full"
        >
            {/* Header + Toggle Button chung 1 hàng */}
            <div className={`p-4 border-b border-gray-200 sticky top-0 bg-white z-10 flex items-center ${isOpen ? 'justify-between' : 'justify-center'}`}>

                {/* Nội dung học */}
                <AnimatePresence mode="wait">
                    {isOpen && (
                        <motion.div
                            key="title"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="min-w-0"

                        >
                            <h2 className="font-bold text-lg text-gray-900 font-poppins whitespace-nowrap">
                                Nội dung học
                            </h2>
                            <p className="text-sm text-gray-500 font-open-sans mt-1 whitespace-nowrap">
                                {lessons.length} bài học
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Toggle Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="cursor-pointer w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
                    aria-label={isOpen ? 'Thu gọn sidebar' : 'Mở rộng sidebar'}
                >
                    {isOpen ? (
                        <ChevronLeft className="w-4 h-4 text-gray-600" />
                    ) : (
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                    )}
                </button>
            </div>


            <div className="p-2">
                {isLoading ? (
                    <div className="px-2">
                        <LessonListSkeleton />
                    </div>
                ) : lessons.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-sm whitespace-nowrap">
                        Chưa có bài học nào
                    </div>
                ) : (
                    <div className="space-y-1">
                        {lessons.map((lesson, index) => (
                            <div key={lesson.lessonId}>
                                {/* Lecture with children */}
                                {lesson.lessonType === 'lecture' && lesson.lecture?.children && lesson.lecture.children.length > 0 ? (
                                    <div>
                                        {/* Parent Lecture */}
                                        <button
                                            onClick={() => {
                                                toggleLecture(lesson.lessonId);
                                                onLessonSelect(lesson);
                                            }}
                                            className={`cursor-pointer w-full flex items-center ${isOpen ? 'gap-3' : 'justify-center'} p-3 rounded-lg transition-colors ${isLessonSelected(lesson)
                                                ? 'bg-blue-50 text-blue-600'
                                                : 'hover:bg-gray-50 text-gray-700'
                                                }`}
                                        >
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getLessonTypeColor(lesson.lessonType)}`}>
                                                {getLessonIcon(lesson.lessonType)}
                                            </div>

                                            <div className="flex-1 text-left min-w-0" style={{ opacity: isOpen ? 1 : 0, width: isOpen ? 'auto' : 0, overflow: 'hidden', transition: 'opacity 0.2s, width 0.2s' }}>
                                                <p className="font-medium text-sm truncate font-poppins whitespace-nowrap">
                                                    {getLessonTitle(lesson)}
                                                </p>
                                                <p className="text-xs text-gray-500 font-open-sans whitespace-nowrap">
                                                    {lesson.lecture.children.length} bài học con
                                                </p>
                                            </div>

                                            <motion.div
                                                animate={{ rotate: expandedLectures.has(lesson.lessonId) ? 180 : 0 }}
                                                transition={{ duration: 0.2 }}
                                                style={{ opacity: isOpen ? 1 : 0, width: isOpen ? 'auto' : 0, overflow: 'hidden' }}
                                            >
                                                <ChevronDown className="w-4 h-4 text-gray-400" />
                                            </motion.div>
                                        </button>

                                        {/* Children */}
                                        <AnimatePresence>
                                            {expandedLectures.has(lesson.lessonId) && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-2">
                                                        {lesson.lecture.children.map((child) => (
                                                            <button
                                                                key={child.lectureId}
                                                                onClick={() => onLessonSelect(lesson, child.lectureId)}
                                                                className={`cursor-pointer w-full flex items-center ${isOpen ? 'gap-2' : 'justify-center'} p-2 rounded-lg transition-colors text-left ${isLessonSelected(lesson, child.lectureId)
                                                                    ? 'bg-blue-50 text-blue-600'
                                                                    : 'hover:bg-gray-50 text-gray-600'
                                                                    }`}
                                                            >
                                                                <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ opacity: isOpen ? 1 : 0, width: isOpen ? 'auto' : 0 }} />
                                                                <FileText className="w-4 h-4 flex-shrink-0" />
                                                                <p className="text-sm truncate font-open-sans flex-1 whitespace-nowrap" style={{ opacity: isOpen ? 1 : 0, width: isOpen ? 'auto' : 0, overflow: 'hidden' }}>
                                                                    {child.title}
                                                                </p>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ) : (
                                    /* Regular lesson or lecture without children */
                                    <button
                                        onClick={() => onLessonSelect(lesson)}
                                        className={`cursor-pointer w-full flex items-center ${isOpen ? 'gap-3' : 'justify-center'} p-3 rounded-lg transition-colors ${isLessonSelected(lesson)
                                            ? lesson.lessonType === 'lecture'
                                                ? 'bg-blue-50 text-blue-600'
                                                : lesson.lessonType === 'exercise'
                                                    ? 'bg-orange-50 text-orange-600'
                                                    : 'bg-purple-50 text-purple-600'
                                            : 'hover:bg-gray-50 text-gray-700'
                                            }`}
                                    >
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getLessonTypeColor(lesson.lessonType)}`}>
                                            {getLessonIcon(lesson.lessonType)}
                                        </div>

                                        <div className="flex-1 text-left min-w-0" style={{ opacity: isOpen ? 1 : 0, width: isOpen ? 'auto' : 0, overflow: 'hidden', transition: 'opacity 0.2s, width 0.2s' }}>
                                            <p className="font-medium text-sm truncate font-poppins whitespace-nowrap">
                                                {getLessonTitle(lesson)}
                                            </p>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 font-open-sans mt-0.5">
                                                <span className="flex items-center gap-1 whitespace-nowrap">
                                                    <Calendar className="w-3 h-3" />
                                                    {formatDate(lesson.createdAt)}
                                                </span>
                                                {lesson.exerciseDueAt && (
                                                    <span className="flex items-center gap-1 text-orange-600 whitespace-nowrap">
                                                        <AlarmClock className="w-3 h-3" />
                                                        {formatDate(lesson.exerciseDueAt)}
                                                    </span>
                                                )}
                                                {lesson.quizEndAt && (
                                                    <span className="flex items-center gap-1 text-purple-600 whitespace-nowrap">
                                                        <Clock4 className="w-3 h-3" />
                                                        {formatDate(lesson.quizEndAt)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
