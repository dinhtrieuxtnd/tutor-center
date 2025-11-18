import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { classroomApi } from "@/services";
import {
    ClassroomResponse,
    ClassroomQueryRequest,
    CreateClassroomRequest,
    UpdateClassroomRequest,
    ClassroomStudentResponse,
} from "@/services/classroomApi";

export interface ClassroomState {
    classrooms: ClassroomResponse[];
    myEnrollments: ClassroomResponse[];
    currentClassroom: ClassroomResponse | null;
    students: ClassroomStudentResponse[];
    total: number;
    page: number;
    pageSize: number;
    isLoading: boolean;
    isLoadingEnrollments: boolean;
    error: string | null;
}

const initialState: ClassroomState = {
    classrooms: [],
    myEnrollments: [],
    currentClassroom: null,
    students: [],
    total: 0,
    page: 1,
    pageSize: 20,
    isLoading: false,
    isLoadingEnrollments: false,
    error: null,
};

// Async Thunks
export const fetchClassrooms = createAsyncThunk<
    { items: ClassroomResponse[]; total: number; page: number; pageSize: number },
    ClassroomQueryRequest | undefined
>(
    "classroom/fetchClassrooms",
    async (params, { rejectWithValue }) => {
        try {
            const response = await classroomApi.query(params);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Không thể tải danh sách lớp học");
        }
    }
);

export const fetchMyClassrooms = createAsyncThunk<
    { items: ClassroomResponse[]; total: number; page: number; pageSize: number }
>(
    "classroom/fetchMyClassrooms",
    async (_, { rejectWithValue }) => {
        try {
            const response = await classroomApi.getMyClassrooms();
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Không thể tải lớp học của bạn");
        }
    }
);

export const fetchMyEnrollments = createAsyncThunk<ClassroomResponse[]>(
    "classroom/fetchMyEnrollments",
    async (_, { rejectWithValue }) => {
        try {
            const response = await classroomApi.getMyEnrollments();
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Không thể tải lớp học đã tham gia");
        }
    }
);

export const fetchClassroomById = createAsyncThunk<ClassroomResponse, number | string>(
    "classroom/fetchClassroomById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await classroomApi.getById(id);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Không thể tải thông tin lớp học");
        }
    }
);

export const createClassroom = createAsyncThunk<
    ClassroomResponse,
    CreateClassroomRequest
>(
    "classroom/createClassroom",
    async (data, { rejectWithValue }) => {
        try {
            const response = await classroomApi.create(data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Không thể tạo lớp học");
        }
    }
);

export const updateClassroom = createAsyncThunk<
    { id: number | string; data: UpdateClassroomRequest },
    { id: number | string; data: UpdateClassroomRequest }
>(
    "classroom/updateClassroom",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            await classroomApi.update(id, data);
            return { id, data };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Không thể cập nhật lớp học");
        }
    }
);

export const archiveClassroom = createAsyncThunk<string, number | string>(
    "classroom/archiveClassroom",
    async (id, { rejectWithValue }) => {
        try {
            const response = await classroomApi.archive(id);
            return response.data.message;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Không thể lưu trữ lớp học");
        }
    }
);

export const deleteClassroom = createAsyncThunk<number | string, number | string>(
    "classroom/deleteClassroom",
    async (id, { rejectWithValue }) => {
        try {
            await classroomApi.delete(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Không thể xóa lớp học");
        }
    }
);

export const fetchClassroomStudents = createAsyncThunk<
    ClassroomStudentResponse[],
    number | string
>(
    "classroom/fetchClassroomStudents",
    async (classroomId, { rejectWithValue }) => {
        try {
            const response = await classroomApi.getStudents(classroomId);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Không thể tải danh sách học sinh");
        }
    }
);

export const removeStudentFromClassroom = createAsyncThunk<
    { classroomId: number | string; studentId: number | string },
    { classroomId: number | string; studentId: number | string }
>(
    "classroom/removeStudentFromClassroom",
    async ({ classroomId, studentId }, { rejectWithValue }) => {
        try {
            await classroomApi.removeStudent(classroomId, studentId);
            return { classroomId, studentId };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Không thể xóa học sinh khỏi lớp");
        }
    }
);

// Slice
const classroomSlice = createSlice({
    name: "classroom",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearCurrentClassroom: (state) => {
            state.currentClassroom = null;
        },
        clearStudents: (state) => {
            state.students = [];
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
        setPageSize: (state, action: PayloadAction<number>) => {
            state.pageSize = action.payload;
        },
    },
    extraReducers: (builder) => {
        // Fetch classrooms
        builder
            .addCase(fetchClassrooms.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchClassrooms.fulfilled, (state, action) => {
                state.isLoading = false;
                state.classrooms = action.payload.items;
                state.total = action.payload.total;
                state.page = action.payload.page;
                state.pageSize = action.payload.pageSize;
            })
            .addCase(fetchClassrooms.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Fetch my classrooms (tutor)
        builder
            .addCase(fetchMyClassrooms.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchMyClassrooms.fulfilled, (state, action) => {
                state.isLoading = false;
                state.classrooms = action.payload.items;
                state.total = action.payload.total;
                state.page = action.payload.page;
                state.pageSize = action.payload.pageSize;
            })
            .addCase(fetchMyClassrooms.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Fetch my enrollments (student)
        builder
            .addCase(fetchMyEnrollments.pending, (state) => {
                state.isLoadingEnrollments = true;
                state.error = null;
            })
            .addCase(fetchMyEnrollments.fulfilled, (state, action) => {
                state.isLoadingEnrollments = false;
                state.myEnrollments = action.payload;
            })
            .addCase(fetchMyEnrollments.rejected, (state, action) => {
                state.isLoadingEnrollments = false;
                state.error = action.payload as string;
            });

        // Fetch classroom by ID
        builder
            .addCase(fetchClassroomById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchClassroomById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentClassroom = action.payload;
            })
            .addCase(fetchClassroomById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Create classroom
        builder
            .addCase(createClassroom.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createClassroom.fulfilled, (state, action) => {
                state.isLoading = false;
                state.classrooms.unshift(action.payload);
                state.total += 1;
            })
            .addCase(createClassroom.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Update classroom
        builder
            .addCase(updateClassroom.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateClassroom.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.classrooms.findIndex(
                    (c) => c.classroomId === action.payload.id
                );
                if (index !== -1) {
                    state.classrooms[index] = {
                        ...state.classrooms[index],
                        ...action.payload.data,
                    };
                }
                if (state.currentClassroom?.classroomId === action.payload.id) {
                    state.currentClassroom = {
                        ...state.currentClassroom,
                        ...action.payload.data,
                    };
                }
            })
            .addCase(updateClassroom.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Archive classroom
        builder
            .addCase(archiveClassroom.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(archiveClassroom.fulfilled, (state, action) => {
                state.isLoading = false;
                // Message will be handled by notification
            })
            .addCase(archiveClassroom.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Delete classroom
        builder
            .addCase(deleteClassroom.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteClassroom.fulfilled, (state, action) => {
                state.isLoading = false;
                state.classrooms = state.classrooms.filter(
                    (c) => c.classroomId !== action.payload
                );
                state.total -= 1;
                if (state.currentClassroom?.classroomId === action.payload) {
                    state.currentClassroom = null;
                }
            })
            .addCase(deleteClassroom.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Fetch classroom students
        builder
            .addCase(fetchClassroomStudents.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchClassroomStudents.fulfilled, (state, action) => {
                state.isLoading = false;
                state.students = action.payload;
            })
            .addCase(fetchClassroomStudents.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Remove student from classroom
        builder
            .addCase(removeStudentFromClassroom.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(removeStudentFromClassroom.fulfilled, (state, action) => {
                state.isLoading = false;
                state.students = state.students.filter(
                    (s) => s.userId !== action.payload.studentId
                );
            })
            .addCase(removeStudentFromClassroom.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const {
    clearError,
    clearCurrentClassroom,
    clearStudents,
    setPage,
    setPageSize,
} = classroomSlice.actions;

export default classroomSlice.reducer;
