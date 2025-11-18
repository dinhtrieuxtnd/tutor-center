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

export default function LearnPage() {
    const params = useParams();
    const router = useRouter();
    const classId = params.id as string;

    const [selectedLesson, setSelectedLesson] = useState<LessonResponse | null>(null);
    const [selectedLectureId, setSelectedLectureId] = useState<number | null>(null);

    const { currentClassroom, fetchClassroomById } = useClassroom();
    const { lessons, isLoading, fetchLessonsByClassroom } = useLesson();

    useEffect(() => {
        if (classId) {
            fetchClassroomById(classId);
            fetchLessonsByClassroom(classId);
        }
    }, [classId]);

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
                            onClick={() => router.push('/student/class')}
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
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <LessonSidebar
                    lessons={lessons}
                    isLoading={isLoading}
                    selectedLesson={selectedLesson}
                    selectedLectureId={selectedLectureId}
                    onLessonSelect={handleLessonSelect}
                />

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}
