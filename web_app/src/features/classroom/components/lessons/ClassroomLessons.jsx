import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../core/store/hooks';
import {
    getLessonsByClassroomAsync,
    assignLectureAsync,
    assignExerciseAsync,
    assignQuizAsync,
} from '../../../lesson/store/lessonSlice';
import { BookOpen, Filter, Plus } from 'lucide-react';
import { Spinner } from '../../../../shared/components/loading/Loading';
import { LectureItem } from './LectureItem';
import { ExerciseItem } from './ExerciseItem';
import { QuizItem } from './QuizItem';
import { AddLessonPanel } from './AddLessonPanel';
import { ViewLecturePanel } from '../../../lecture/components/ViewLecturePanel';
import { ViewExercisePanel } from '../../../exercise/components/ViewExercisePanel';

export const ClassroomLessons = ({ classroomId }) => {
    const dispatch = useAppDispatch();
    const { lessons, loading, assignLectureLoading, assignExerciseLoading, assignQuizLoading } = useAppSelector((state) => state.lesson);
    const [filterType, setFilterType] = useState('all'); // all, lecture, exercise, quiz
    const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
    const [isViewLecturePanelOpen, setIsViewLecturePanelOpen] = useState(false);
    const [viewingLecture, setViewingLecture] = useState(null);
    const [isViewExercisePanelOpen, setIsViewExercisePanelOpen] = useState(false);
    const [viewingExercise, setViewingExercise] = useState(null);

    useEffect(() => {
        if (classroomId) {
            dispatch(getLessonsByClassroomAsync(classroomId));
        }
    }, [classroomId, dispatch]);

    const filteredLessons = lessons.filter((lesson) => {
        if (filterType === 'all') return true;
        return lesson.lessonType.toLowerCase() === filterType;
    });

    const lessonTypeCount = {
        all: lessons.length,
        lecture: lessons.filter((l) => l.lessonType.toLowerCase() === 'lecture').length,
        exercise: lessons.filter((l) => l.lessonType.toLowerCase() === 'exercise').length,
        quiz: lessons.filter((l) => l.lessonType.toLowerCase() === 'quiz').length,
    };

    const handleAddLesson = async (data, lessonType) => {
        let result;
        if (lessonType === 'lecture') {
            result = await dispatch(assignLectureAsync(data));
        } else if (lessonType === 'exercise') {
            result = await dispatch(assignExerciseAsync(data));
        } else if (lessonType === 'quiz') {
            result = await dispatch(assignQuizAsync(data));
        }

        if (result.type.endsWith('/fulfilled')) {
            setIsAddPanelOpen(false);
            // Refresh lessons list
            dispatch(getLessonsByClassroomAsync(classroomId));
        }
    };

    const handleViewLecture = (lecture) => {
        setViewingLecture(lecture);
        setIsViewLecturePanelOpen(true);
    };

    const handleViewExercise = (exercise) => {
        setViewingExercise(exercise);
        setIsViewExercisePanelOpen(true);
    };

    const isSubmitLoading = assignLectureLoading || assignExerciseLoading || assignQuizLoading;

    const renderLesson = (lesson) => {
        const lessonType = lesson.lessonType.toLowerCase();

        if (lessonType === 'lecture' && lesson.lecture) {
            return <LectureItem key={lesson.id} lecture={lesson.lecture} onView={handleViewLecture} />;
        }
        if (lessonType === 'exercise' && lesson.exercise) {
            return <ExerciseItem key={lesson.id} exercise={lesson.exercise} exerciseDueAt={lesson.exerciseDueAt} onView={handleViewExercise} />;
        }
        if (lessonType === 'quiz' && lesson.quiz) {
            return <QuizItem key={lesson.id} quiz={lesson.quiz} />;
        }
        return null;
    };

    /* ================= LOADING ================= */
    if (loading && lessons.length === 0) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <Spinner size="lg" className="mx-auto mb-2" />
                    <p className="text-sm text-foreground-light">Đang tải danh sách buổi học...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header with filters */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <BookOpen size={20} className="text-foreground" />
                    <h2 className="text-lg font-semibold text-foreground">
                        Danh sách buổi học
                        <span className="ml-2 text-sm font-normal text-foreground-light">
                            ({filteredLessons.length} buổi học)
                        </span>
                    </h2>
                    <button
                        onClick={() => setIsAddPanelOpen(true)}
                        className="px-3 py-2 bg-foreground text-white text-sm font-medium rounded-sm hover:bg-gray-800 transition-colors flex items-center gap-2"
                    >
                        <Plus size={16} />
                        Thêm buổi học
                    </button>
                </div>

                {/* Filter buttons */}
                <div className="flex items-center gap-2">
                    <span className="text-xs text-foreground-light flex items-center gap-1">
                        <Filter size={14} />
                        Lọc:
                    </span>
                    <div className="flex gap-1">
                        {[
                            { key: 'all', label: 'Tất cả', color: 'gray' },
                            { key: 'lecture', label: 'Bài giảng', color: 'blue' },
                            { key: 'exercise', label: 'Bài tập', color: 'green' },
                            { key: 'quiz', label: 'Kiểm tra', color: 'purple' },
                        ].map((type) => (
                            <button
                                key={type.key}
                                onClick={() => setFilterType(type.key)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${filterType === type.key
                                    ? `bg-${type.color}-600 text-white`
                                    : 'bg-gray-100 text-foreground-light hover:bg-gray-200'
                                    }`}
                                style={
                                    filterType === type.key
                                        ? {
                                            backgroundColor:
                                                type.color === 'gray'
                                                    ? '#6B7280'
                                                    : type.color === 'blue'
                                                        ? '#3B82F6'
                                                        : type.color === 'green'
                                                            ? '#10B981'
                                                            : '#9333EA',
                                        }
                                        : undefined
                                }
                            >
                                {type.label} ({lessonTypeCount[type.key]})
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Lessons list */}
            <div className="bg-primary border border-border rounded-sm overflow-hidden">
                {filteredLessons.length === 0 ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <BookOpen size={48} className="text-gray-300 mx-auto mb-3" />
                            <p className="text-sm text-foreground-light">
                                {filterType === 'all'
                                    ? 'Chưa có buổi học nào'
                                    : `Chưa có ${filterType === 'lecture'
                                        ? 'bài giảng'
                                        : filterType === 'exercise'
                                            ? 'bài tập'
                                            : 'bài kiểm tra'
                                    } nào`}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {filteredLessons.map((lesson) => renderLesson(lesson))}
                    </div>
                )}
            </div>

            {/* Add Lesson Panel */}
            <AddLessonPanel
                isOpen={isAddPanelOpen}
                onClose={() => setIsAddPanelOpen(false)}
                onSubmit={handleAddLesson}
                isLoading={isSubmitLoading}
                classroomId={classroomId}
            />

            {/* View Lecture Panel */}
            <ViewLecturePanel
                isOpen={isViewLecturePanelOpen}
                onClose={() => {
                    setIsViewLecturePanelOpen(false);
                    setViewingLecture(null);
                }}
                lecture={viewingLecture}
            />

            {/* View Exercise Panel */}
            <ViewExercisePanel
                isOpen={isViewExercisePanelOpen}
                onClose={() => {
                    setIsViewExercisePanelOpen(false);
                    setViewingExercise(null);
                }}
                exercise={viewingExercise}
            />
        </div>
    );
};
