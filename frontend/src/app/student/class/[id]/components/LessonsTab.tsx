import { LessonResponse } from '@/services/lessonApi';
import { LessonCard } from './LessonCard';
import { LessonListSkeleton } from '@/components/loading';

interface LessonsTabProps {
    lessons: LessonResponse[];
    isLoading?: boolean;
}

export function LessonsTab({ lessons, isLoading }: LessonsTabProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 font-poppins">
                Tất cả bài học ({isLoading ? '...' : lessons.length})
            </h2>
            {isLoading ? (
                <LessonListSkeleton />
            ) : lessons.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Chưa có bài học nào</p>
            ) : (
                <div className="space-y-3">
                    {lessons.map((lesson) => (
                        <LessonCard key={lesson.lessonId} lesson={lesson} />
                    ))}
                </div>
            )}
        </div>
    );
}
