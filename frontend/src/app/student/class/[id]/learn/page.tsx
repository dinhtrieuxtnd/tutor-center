'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useClassroom, useLesson } from '@/hooks';
import {
    Home,
    ChevronRight,
    BookOpen,
    Target,
    CheckCircle2,
    LightbulbIcon
} from 'lucide-react';
import {
    LessonSidebar,
    LearningGuide,
    LectureContent,
    ExerciseContent,
    QuizContent
} from './components';
import { LessonResponse } from '@/services/lessonApi';
import { LearnPageSkeleton } from '@/components/loading';

export default function LearnPage() {
    const params = useParams();
    const router = useRouter();
    const classId = params.id as string;

    const [selectedLesson, setSelectedLesson] = useState<LessonResponse | null>(null);
    const [selectedLectureId, setSelectedLectureId] = useState<number | null>(null);
    const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

    const { currentClassroom, fetchClassroomById } = useClassroom();
    const { lessons, isLoading, fetchLessonsByClassroom } = useLesson();

    useEffect(() => {
        if (classId) {
            fetchClassroomById(classId);
            fetchLessonsByClassroom(classId);
        }
    }, [classId]);

    useEffect(() => {
        if (!isLoading) {
            setIsInitialLoading(false);
        }
    }, [isLoading]);

    if (isInitialLoading) {
        return <LearnPageSkeleton />;
    }

    const handleLessonSelect = (lesson: LessonResponse, lectureId?: number) => {
        setSelectedLesson(lesson);
        setSelectedLectureId(lectureId || null);
    };

    const renderContent = () => {
        if (!selectedLesson) {
            return <LearningGuide />;
        }

        if (selectedLesson.lessonType === 'lecture') {
            return <LectureContent lesson={selectedLesson} lectureId={selectedLectureId} />;
        }

        if (selectedLesson.lessonType === 'exercise') {
            return <ExerciseContent lesson={selectedLesson} />;
        }

        if (selectedLesson.lessonType === 'quiz') {
            return <QuizContent lesson={selectedLesson} />;
        }

        return <LearningGuide />;
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm font-open-sans">
                        <button
                            onClick={() => router.push('/student/class/' + classId)}
                            className="cursor-pointer flex items-center gap-1 text-gray-600 hover:text-primary transition-colors"
                        >
                            <Home className="w-4 h-4" />
                            <span>Lớp học</span>
                        </button>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        <button
                            onClick={() => router.push(`/student/class/${classId}`)}
                            className="cursor-pointer text-gray-600 hover:text-primary transition-colors truncate max-w-[200px]"
                        >
                            {currentClassroom?.name || 'Đang tải...'}
                        </button>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        <span className="text-primary font-medium">Học bài</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden relative">
                {/* Sidebar - Fixed */}
                <div className="flex-shrink-0 border-r border-gray-200 fixed left-0 top-[52px] bottom-0 z-20">
                    <LessonSidebar
                        lessons={lessons}
                        isLoading={isLoading}
                        selectedLesson={selectedLesson}
                        selectedLectureId={selectedLectureId}
                        onLessonSelect={handleLessonSelect}
                        isOpen={isSidebarOpen}
                        setIsOpen={setIsSidebarOpen}
                    />
                </div>

                {/* Content Area with Navigation */}
                <div
                    className="flex-1 flex flex-col transition-all duration-300"
                    style={{ marginLeft: isSidebarOpen ? '320px' : '80px' }}
                >
                    {/* Main Content */}
                    <div className="flex-1 overflow-y-auto pb-20">
                        {renderContent()}
                    </div>

                    {/* Bottom Navigation Bar */}
                    {selectedLesson && (
                        <div
                            className="fixed bottom-0 right-0 bg-white border-t border-gray-200 z-20 transition-all duration-300"
                            style={{ left: isSidebarOpen ? '330px' : '80px' }}
                        >
                            <div className="px-6 py-4 flex items-center justify-between">
                                <button
                                    onClick={() => {
                                        // Logic để tìm lesson/lecture trước đó
                                        const currentIndex = lessons.findIndex(l => l.lessonId === selectedLesson.lessonId);
                                        if (currentIndex > 0) {
                                            handleLessonSelect(lessons[currentIndex - 1]);
                                        }
                                    }}
                                    disabled={lessons.findIndex(l => l.lessonId === selectedLesson.lessonId) === 0}
                                    className="cursor-pointer flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-poppins font-medium"
                                >
                                    <ChevronRight className="w-5 h-5 rotate-180" />
                                    <span>Bài trước</span>
                                </button>

                                <div className="text-sm text-gray-600 font-open-sans">
                                    Bài {lessons.findIndex(l => l.lessonId === selectedLesson.lessonId) + 1} / {lessons.length}
                                </div>

                                <button
                                    onClick={() => {
                                        // Logic để tìm lesson/lecture tiếp theo
                                        const currentIndex = lessons.findIndex(l => l.lessonId === selectedLesson.lessonId);
                                        if (currentIndex < lessons.length - 1) {
                                            handleLessonSelect(lessons[currentIndex + 1]);
                                        }
                                    }}
                                    disabled={lessons.findIndex(l => l.lessonId === selectedLesson.lessonId) === lessons.length - 1}
                                    className="cursor-pointer flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-poppins font-medium"
                                >
                                    <span>Bài tiếp theo</span>
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
