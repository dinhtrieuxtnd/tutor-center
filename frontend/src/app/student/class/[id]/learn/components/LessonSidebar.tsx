import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen,
    Pencil,
    ListChecks,
    ChevronDown,
    ChevronRight,
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
}

export function LessonSidebar({
    lessons,
    isLoading,
    selectedLesson,
    selectedLectureId,
    onLessonSelect,
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
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0">
            <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                <h2 className="font-bold text-lg text-gray-900 font-poppins">
                    Nội dung học
                </h2>
                <p className="text-sm text-gray-500 font-open-sans mt-1">
                    {lessons.length} bài học
                </p>
            </div>

            <div className="p-2">
                {isLoading ? (
                    <div className="px-2">
                        <LessonListSkeleton />
                    </div>
                ) : lessons.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-sm">
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
                                            className={`cursor-pointer w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${isLessonSelected(lesson)
                                                    ? 'bg-blue-50 text-blue-600'
                                                    : 'hover:bg-gray-50 text-gray-700'
                                                }`}
                                        >
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getLessonTypeColor(lesson.lessonType)}`}>
                                                {getLessonIcon(lesson.lessonType)}
                                            </div>

                                            <div className="flex-1 text-left min-w-0">
                                                <p className="font-medium text-sm truncate font-poppins">
                                                    {getLessonTitle(lesson)}
                                                </p>
                                                <p className="text-xs text-gray-500 font-open-sans">
                                                    {lesson.lecture.children.length} bài học con
                                                </p>
                                            </div>

                                            <motion.div
                                                animate={{ rotate: expandedLectures.has(lesson.lessonId) ? 180 : 0 }}
                                                transition={{ duration: 0.2 }}
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
                                                                className={`cursor-pointer w-full flex items-center gap-2 p-2 rounded-lg transition-colors text-left ${isLessonSelected(lesson, child.lectureId)
                                                                        ? 'bg-blue-50 text-blue-600'
                                                                        : 'hover:bg-gray-50 text-gray-600'
                                                                    }`}
                                                            >
                                                                <ChevronRight className="w-4 h-4 flex-shrink-0" />
                                                                <FileText className="w-4 h-4 flex-shrink-0" />
                                                                <p className="text-sm truncate font-open-sans flex-1">
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
                                        className={`cursor-pointer w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${isLessonSelected(lesson)
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

                                        <div className="flex-1 text-left min-w-0">
                                            <p className="font-medium text-sm truncate font-poppins">
                                                {getLessonTitle(lesson)}
                                            </p>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 font-open-sans mt-0.5">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {formatDate(lesson.createdAt)}
                                                </span>
                                                {lesson.exerciseDueAt && (
                                                    <span className="flex items-center gap-1 text-orange-600">
                                                        <AlarmClock className="w-3 h-3" />
                                                        {formatDate(lesson.exerciseDueAt)}
                                                    </span>
                                                )}
                                                {lesson.quizEndAt && (
                                                    <span className="flex items-center gap-1 text-purple-600">
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
        </div>
    );
}
