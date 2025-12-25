import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { lessonApi } from '../../../core/api/lessonApi';
import { handleAsyncThunk } from '../../../shared/utils/asyncThunkHelper';

const initialState = {
  lessons: [],
  currentLesson: null,
  loading: false,
  assignLectureLoading: false,
  assignExerciseLoading: false,
  assignQuizLoading: false,
  error: null,
};

// Async thunks
export const assignLectureAsync = createAsyncThunk(
  'lesson/assignLecture',
  async (data, thunkAPI) => {
    return handleAsyncThunk(
      () => lessonApi.assignLecture(data),
      thunkAPI,
      {
        successTitle: 'Gán bài giảng thành công',
        successMessage: 'Bài giảng đã được gán vào lớp học',
        errorTitle: 'Gán bài giảng thất bại',
      }
    );
  }
);

export const assignExerciseAsync = createAsyncThunk(
  'lesson/assignExercise',
  async (data, thunkAPI) => {
    return handleAsyncThunk(
      () => lessonApi.assignExercise(data),
      thunkAPI,
      {
        successTitle: 'Gán bài tập thành công',
        successMessage: 'Bài tập đã được gán vào lớp học',
        errorTitle: 'Gán bài tập thất bại',
      }
    );
  }
);

export const assignQuizAsync = createAsyncThunk(
  'lesson/assignQuiz',
  async (data, thunkAPI) => {
    return handleAsyncThunk(
      () => lessonApi.assignQuiz(data),
      thunkAPI,
      {
        successTitle: 'Gán bài kiểm tra thành công',
        successMessage: 'Bài kiểm tra đã được gán vào lớp học',
        errorTitle: 'Gán bài kiểm tra thất bại',
      }
    );
  }
);

export const getLessonsByClassroomAsync = createAsyncThunk(
  'lesson/getLessonsByClassroom',
  async (classroomId, thunkAPI) => {
    return handleAsyncThunk(
      () => lessonApi.getLessonsByClassroom(classroomId),
      thunkAPI,
      {
        showSuccess: false,
        errorTitle: 'Lỗi tải danh sách bài học',
      }
    );
  }
);

const lessonSlice = createSlice({
  name: 'lesson',
  initialState,
  reducers: {
    clearCurrentLesson: (state) => {
      state.currentLesson = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentLesson: (state, action) => {
      state.currentLesson = action.payload;
    },
    clearLessons: (state) => {
      state.lessons = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Assign lecture
      .addCase(assignLectureAsync.pending, (state) => {
        state.assignLectureLoading = true;
        state.error = null;
      })
      .addCase(assignLectureAsync.fulfilled, (state, action) => {
        state.assignLectureLoading = false;
        const newLesson = action.payload.data || action.payload;
        // Add to lessons list if not already present
        const exists = state.lessons.some(l => l.lessonId === newLesson.lessonId);
        if (!exists) {
          state.lessons.push(newLesson);
        }
        state.error = null;
      })
      .addCase(assignLectureAsync.rejected, (state, action) => {
        state.assignLectureLoading = false;
        state.error = action.payload;
      })
      // Assign exercise
      .addCase(assignExerciseAsync.pending, (state) => {
        state.assignExerciseLoading = true;
        state.error = null;
      })
      .addCase(assignExerciseAsync.fulfilled, (state, action) => {
        state.assignExerciseLoading = false;
        const newLesson = action.payload.data || action.payload;
        const exists = state.lessons.some(l => l.lessonId === newLesson.lessonId);
        if (!exists) {
          state.lessons.push(newLesson);
        }
        state.error = null;
      })
      .addCase(assignExerciseAsync.rejected, (state, action) => {
        state.assignExerciseLoading = false;
        state.error = action.payload;
      })
      // Assign quiz
      .addCase(assignQuizAsync.pending, (state) => {
        state.assignQuizLoading = true;
        state.error = null;
      })
      .addCase(assignQuizAsync.fulfilled, (state, action) => {
        state.assignQuizLoading = false;
        const newLesson = action.payload.data || action.payload;
        const exists = state.lessons.some(l => l.lessonId === newLesson.lessonId);
        if (!exists) {
          state.lessons.push(newLesson);
        }
        state.error = null;
      })
      .addCase(assignQuizAsync.rejected, (state, action) => {
        state.assignQuizLoading = false;
        state.error = action.payload;
      })
      // Get lessons by classroom
      .addCase(getLessonsByClassroomAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLessonsByClassroomAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.lessons = action.payload.data || action.payload || [];
        state.error = null;
      })
      .addCase(getLessonsByClassroomAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearCurrentLesson,
  clearError,
  setCurrentLesson,
  clearLessons,
} = lessonSlice.actions;

export default lessonSlice.reducer;
