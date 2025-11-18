import {
    Clock,
    Calendar,
    Users
} from 'lucide-react';
import { LessonResponse } from '@/services/lessonApi';
import { ClassroomResponse } from '@/services/classroomApi';
import { LessonCard } from './LessonCard';
import { LessonListSkeleton } from '@/components/loading';

interface OverviewTabProps {
    classData: ClassroomResponse;
    lessons: LessonResponse[];
    onViewAllLessons: () => void;
    isLoading?: boolean;
}

export function OverviewTab({ classData, lessons, onViewAllLessons, isLoading }: OverviewTabProps) {
    // Mock data cho các trường chưa có trong API
    const totalLessons = 36;
    const completedLessons = 12;
    const progress = 65;
    // Lấy bài học hôm nay
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayLessons = lessons.filter(lesson => {
        const lessonDate = new Date(lesson.createdAt);
        lessonDate.setHours(0, 0, 0, 0);
        return lessonDate.getTime() === today.getTime();
    });

    const getTodayLessonTitle = (lesson: LessonResponse) => {
        if (lesson.lecture) return lesson.lecture.title;
        if (lesson.exercise) return lesson.exercise.title;
        if (lesson.quiz) return lesson.quiz.title;
        return 'Bài học hôm nay';
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const days = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
        return `${days[date.getDay()]}, ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    return (
        <div className="space-y-6">
            {/* Today's Lesson */}
            {todayLessons.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 font-poppins flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        Bài học hôm nay
                    </h2>
                    {isLoading ? (
                        <LessonListSkeleton />
                    ) : todayLessons.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">Không có bài học nào hôm nay</p>
                    ) : (
                        <div className="space-y-3">
                            {todayLessons.map((lesson) => (
                               <LessonCard key={lesson.lessonId} lesson={lesson} />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* About */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 font-poppins">
                    Về lớp học này
                </h2>
                <p className="text-gray-700 leading-relaxed font-open-sans">
                    {classData.description}
                </p>
                <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600 font-open-sans">
                        <Users className="w-4 h-4" />
                        <span>Giáo viên: <strong>{classData.tutorName}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 font-open-sans">
                        <Users className="w-4 h-4" />
                        <span>Số học sinh: <strong>{classData.studentCount}</strong></span>
                    </div>
                    {classData.price > 0 && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 font-open-sans">
                            <span>Học phí: <strong className="text-primary">{classData.price.toLocaleString('vi-VN')} VNĐ</strong></span>
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Lessons */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 font-poppins">
                    Bài học gần đây
                </h2>
                {isLoading ? (
                    <LessonListSkeleton />
                ) : lessons.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Chưa có bài học nào</p>
                ) : (
                    <div className="space-y-3">
                        {lessons.slice(0, 3).map((lesson) => (
                            <LessonCard key={lesson.lessonId} lesson={lesson} />
                        ))}
                    </div>
                )}
                <button
                    onClick={onViewAllLessons}
                    className="mt-4 text-sm text-primary hover:text-blue-700 font-medium font-open-sans"
                >
                    Xem tất cả bài học →
                </button>
            </div>
        </div>
    );
}
