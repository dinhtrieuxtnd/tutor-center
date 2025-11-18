import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import {
    fetchLessonsByClassroom,
    fetchLessonsByClassroomPublic,
    assignLecture,
    assignExercise,
    assignQuiz,
    deleteLesson,
    clearError,
    clearLessons,
    clearCurrentLesson,
    setCurrentLesson,
} from "@/store/features/lesson/lessonSlice";
import {
    AssignLectureRequest,
    AssignExerciseRequest,
    AssignQuizRequest,
    LessonResponse,
} from "@/services/lessonApi";

export const useLesson = () => {
    const dispatch: AppDispatch = useDispatch();

    // Lấy state từ slice
    const {
        lessons,
        currentLesson,
        isLoading,
        error,
    } = useSelector((state: RootState) => state.lesson);

    // Action handlers
    const handleFetchLessonsByClassroom = useCallback(
        (classroomId: number | string) => {
            return dispatch(fetchLessonsByClassroom(classroomId));
        },
        [dispatch]
    );

    const handleFetchLessonsByClassroomPublic = useCallback(
        (classroomId: number | string) => {
            return dispatch(fetchLessonsByClassroomPublic(classroomId));
        },
        [dispatch]
    );

    const handleAssignLecture = useCallback(
        (data: AssignLectureRequest) => {
            return dispatch(assignLecture(data));
        },
        [dispatch]
    );

    const handleAssignExercise = useCallback(
        (data: AssignExerciseRequest) => {
            return dispatch(assignExercise(data));
        },
        [dispatch]
    );

    const handleAssignQuiz = useCallback(
        (data: AssignQuizRequest) => {
            return dispatch(assignQuiz(data));
        },
        [dispatch]
    );

    const handleDeleteLesson = useCallback(
        (lessonId: number | string) => {
            return dispatch(deleteLesson(lessonId));
        },
        [dispatch]
    );

    const handleClearError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    const handleClearLessons = useCallback(() => {
        dispatch(clearLessons());
    }, [dispatch]);

    const handleClearCurrentLesson = useCallback(() => {
        dispatch(clearCurrentLesson());
    }, [dispatch]);

    const handleSetCurrentLesson = useCallback(
        (lesson: LessonResponse | null) => {
            dispatch(setCurrentLesson(lesson));
        },
        [dispatch]
    );

    return {
        // State
        lessons,
        currentLesson,
        isLoading,
        error,

        // Actions
        fetchLessonsByClassroom: handleFetchLessonsByClassroom,
        fetchLessonsByClassroomPublic: handleFetchLessonsByClassroomPublic,
        assignLecture: handleAssignLecture,
        assignExercise: handleAssignExercise,
        assignQuiz: handleAssignQuiz,
        deleteLesson: handleDeleteLesson,
        clearError: handleClearError,
        clearLessons: handleClearLessons,
        clearCurrentLesson: handleClearCurrentLesson,
        setCurrentLesson: handleSetCurrentLesson,
    };
};
