import { useRouter } from 'next/navigation';
import {
    Pencil,
    ListChecks,
    Calendar,
    AlarmClock,
    Clock4,
} from 'lucide-react';
import { LessonResponse } from '@/services/lessonApi';
import { LectureCard } from './LectureCard';

interface LessonCardProps {
    lesson: LessonResponse;
}

export function LessonCard({ lesson }: LessonCardProps) {
    const router = useRouter();

    // Nếu là lecture thì dùng LectureCard
    if (lesson.lessonType === 'lecture') {
        return <LectureCard lesson={lesson} />;
    }

    const getLessonTypeIcon = (lessonType: string) => {
        switch (lessonType) {
            case 'exercise':
                return <Pencil className="w-6 h-6" />;
            case 'quiz':
                return <ListChecks className="w-6 h-6" />;
            default:
                return <Pencil className="w-6 h-6" />;
        }
    };

    const getLessonTypeLabel = (lessonType: string) => {
        switch (lessonType) {
            case 'exercise': return 'Bài tập';
            case 'quiz': return 'Bài kiểm tra';
            default: return 'Khác';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const getLessonTitle = () => {
        if (lesson.exercise) return lesson.exercise.title || 'Bài tập không tiêu đề';
        if (lesson.quiz) return lesson.quiz.title || 'Bài kiểm tra không tiêu đề';
        return 'Không có tiêu đề';
    };

    const getLessonDescription = () => {
        if (lesson.exercise) return lesson.exercise.description || null;
        if (lesson.quiz) return lesson.quiz.description || null;
        return null;
    };

    return (
        <div
            className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-all cursor-pointer"
        >
            <div
                className={`
                    w-12 h-12 rounded-lg flex items-center justify-center
                    ${lesson.lessonType === 'exercise'
                        ? 'bg-orange-100 text-orange-600'
                        : 'bg-purple-100 text-purple-600'
                    }
                `}
            >
                {getLessonTypeIcon(lesson.lessonType)}
            </div>

            <div className="flex-1 flex flex-col gap-2">
                {/* Hàng ngang */}
                <div className="flex flex-wrap items-center justify-between gap-4">

                    {/* Title + Badge */}
                    <div className="flex items-center gap-3 min-w-[200px]">
                        <h3 className="font-semibold text-gray-900 font-poppins">
                            {getLessonTitle()}
                        </h3>

                        <span
                            className={`
                    text-xs px-2 py-1 rounded-full font-open-sans
                    ${lesson.lessonType === 'exercise'
                                    ? 'bg-orange-100 text-orange-800'
                                    : 'bg-purple-100 text-purple-800'
                                }
                `}
                        >
                            {getLessonTypeLabel(lesson.lessonType)}
                        </span>
                    </div>

                    {/* Ngày tháng / deadline */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 font-open-sans flex-wrap">

                        {/* Ngày tạo */}
                        <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(lesson.createdAt)}
                        </span>

                        {lesson.exerciseDueAt && (
                            <span className="flex items-center gap-1 text-orange-600">
                                <AlarmClock className="w-4 h-4" />
                                Hạn: {formatDate(lesson.exerciseDueAt)}
                            </span>
                        )}

                        {lesson.quizEndAt && (
                            <span className="flex items-center gap-1 text-purple-600">
                                <Clock4 className="w-4 h-4" />
                                Kết thúc: {formatDate(lesson.quizEndAt)}
                            </span>
                        )}
                    </div>
                </div>

                {/* Description */}
                {getLessonDescription() && (
                    <p className="text-sm text-gray-600 font-open-sans">
                        {getLessonDescription()}
                    </p>
                )}
            </div>

        </div>
    );
}
