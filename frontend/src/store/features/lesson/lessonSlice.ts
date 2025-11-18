import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { lessonApi } from "@/services";
import {
    LessonResponse,
    AssignLectureRequest,
    AssignExerciseRequest,
    AssignQuizRequest,
} from "@/services/lessonApi";

export interface LessonState {
    lessons: LessonResponse[];
    currentLesson: LessonResponse | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: LessonState = {
    lessons: [],
    currentLesson: null,
    isLoading: false,
    error: null,
};

// Async Thunks
export const fetchLessonsByClassroom = createAsyncThunk<
    LessonResponse[],
    number | string
>(
    "lesson/fetchLessonsByClassroom",
    async (classroomId, { rejectWithValue }) => {
        try {
            const response = await lessonApi.getByClassroom(classroomId);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Không thể tải danh sách bài học");
        }
    }
);

export const fetchLessonsByClassroomPublic = createAsyncThunk<
    LessonResponse[],
    number | string
>(
    "lesson/fetchLessonsByClassroomPublic",
    async (classroomId, { rejectWithValue }) => {
        try {
            const response = await lessonApi.getByClassroomPublic(classroomId);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Không thể tải danh sách bài học");
        }
    }
);

export const assignLecture = createAsyncThunk<
    LessonResponse,
    AssignLectureRequest
>(
    "lesson/assignLecture",
    async (data, { rejectWithValue }) => {
        try {
            const response = await lessonApi.assignLecture(data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Không thể gán bài giảng");
        }
    }
);

export const assignExercise = createAsyncThunk<
    LessonResponse,
    AssignExerciseRequest
>(
    "lesson/assignExercise",
    async (data, { rejectWithValue }) => {
        try {
            const response = await lessonApi.assignExercise(data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Không thể gán bài tập");
        }
    }
);

export const assignQuiz = createAsyncThunk<
    LessonResponse,
    AssignQuizRequest
>(
    "lesson/assignQuiz",
    async (data, { rejectWithValue }) => {
        try {
            const response = await lessonApi.assignQuiz(data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Không thể gán bài quiz");
        }
    }
);

export const deleteLesson = createAsyncThunk<number | string, number | string>(
    "lesson/deleteLesson",
    async (lessonId, { rejectWithValue }) => {
        try {
            await lessonApi.delete(lessonId);
            return lessonId;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Không thể xóa bài học");
        }
    }
);

// Slice
const lessonSlice = createSlice({
    name: "lesson",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearLessons: (state) => {
            state.lessons = [];
        },
        clearCurrentLesson: (state) => {
            state.currentLesson = null;
        },
        setCurrentLesson: (state, action: PayloadAction<LessonResponse | null>) => {
            state.currentLesson = action.payload;
        },
    },
    extraReducers: (builder) => {
        // Fetch lessons by classroom
        builder
            .addCase(fetchLessonsByClassroom.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchLessonsByClassroom.fulfilled, (state, action) => {
                state.isLoading = false;
                state.lessons = action.payload;
            })
            .addCase(fetchLessonsByClassroom.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Fetch lessons by classroom (public)
        builder
            .addCase(fetchLessonsByClassroomPublic.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchLessonsByClassroomPublic.fulfilled, (state, action) => {
                state.isLoading = false;
                state.lessons = action.payload;
            })
            .addCase(fetchLessonsByClassroomPublic.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Assign lecture
        builder
            .addCase(assignLecture.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(assignLecture.fulfilled, (state, action) => {
                state.isLoading = false;
                state.lessons.push(action.payload);
            })
            .addCase(assignLecture.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Assign exercise
        builder
            .addCase(assignExercise.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(assignExercise.fulfilled, (state, action) => {
                state.isLoading = false;
                state.lessons.push(action.payload);
            })
            .addCase(assignExercise.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Assign quiz
        builder
            .addCase(assignQuiz.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(assignQuiz.fulfilled, (state, action) => {
                state.isLoading = false;
                state.lessons.push(action.payload);
            })
            .addCase(assignQuiz.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Delete lesson
        builder
            .addCase(deleteLesson.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteLesson.fulfilled, (state, action) => {
                state.isLoading = false;
                state.lessons = state.lessons.filter(
                    (l) => l.lessonId !== action.payload
                );
                if (state.currentLesson?.lessonId === action.payload) {
                    state.currentLesson = null;
                }
            })
            .addCase(deleteLesson.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const {
    clearError,
    clearLessons,
    clearCurrentLesson,
    setCurrentLesson,
} = lessonSlice.actions;

export default lessonSlice.reducer;
