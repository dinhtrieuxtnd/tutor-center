import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { mediaApi } from "@/services";
import {
    MediaResponse,
    UploadMediaRequest,
    UpdateMediaRequest,
    ListMediaRequest,
} from "@/services/mediaApi";

export interface MediaState {
    mediaList: MediaResponse[];
    userMedia: MediaResponse[];
    currentMedia: MediaResponse | null;
    total: number;
    page: number;
    pageSize: number;
    isLoading: boolean;
    isUploading: boolean;
    uploadProgress: number;
    error: string | null;
}

const initialState: MediaState = {
    mediaList: [],
    userMedia: [],
    currentMedia: null,
    total: 0,
    page: 1,
    pageSize: 20,
    isLoading: false,
    isUploading: false,
    uploadProgress: 0,
    error: null,
};

// Async Thunks
export const fetchMediaList = createAsyncThunk<
    { items: MediaResponse[]; total: number; page: number; pageSize: number },
    ListMediaRequest | undefined
>(
    "media/fetchMediaList",
    async (params, { rejectWithValue }) => {
        try {
            const response = await mediaApi.getList(params);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Không thể tải danh sách media");
        }
    }
);

export const fetchMediaById = createAsyncThunk<MediaResponse, number | string>(
    "media/fetchMediaById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await mediaApi.getById(id);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Không thể tải thông tin media");
        }
    }
);

export const fetchUserMedia = createAsyncThunk<MediaResponse[], number | string>(
    "media/fetchUserMedia",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await mediaApi.getByUser(userId);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Không thể tải media của người dùng");
        }
    }
);

export const uploadMedia = createAsyncThunk<
    MediaResponse,
    UploadMediaRequest,
    { rejectValue: string }
>(
    "media/uploadMedia",
    async (data, { rejectWithValue }) => {
        try {
            const response = await mediaApi.upload(data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Không thể upload file");
        }
    }
);

export const updateMedia = createAsyncThunk<
    { id: number | string; data: UpdateMediaRequest },
    { id: number | string; data: UpdateMediaRequest }
>(
    "media/updateMedia",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            await mediaApi.update(id, data);
            return { id, data };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Không thể cập nhật media");
        }
    }
);

export const deleteMedia = createAsyncThunk<number | string, number | string>(
    "media/deleteMedia",
    async (id, { rejectWithValue }) => {
        try {
            await mediaApi.delete(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Không thể xóa media");
        }
    }
);

export const fetchPresignedUrl = createAsyncThunk<
    { url: string; mediaId: number | string },
    { mediaId: number | string; expirySeconds?: number }
>(
    "media/fetchPresignedUrl",
    async ({ mediaId, expirySeconds }, { rejectWithValue }) => {
        try {
            const response = await mediaApi.getPresigned(mediaId, expirySeconds);
            return { url: response.url, mediaId };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Không thể lấy URL tải xuống");
        }
    }
);

// Slice
const mediaSlice = createSlice({
    name: "media",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearCurrentMedia: (state) => {
            state.currentMedia = null;
        },
        clearUserMedia: (state) => {
            state.userMedia = [];
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
        setPageSize: (state, action: PayloadAction<number>) => {
            state.pageSize = action.payload;
        },
        setUploadProgress: (state, action: PayloadAction<number>) => {
            state.uploadProgress = action.payload;
        },
    },
    extraReducers: (builder) => {
        // Fetch media list
        builder
            .addCase(fetchMediaList.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchMediaList.fulfilled, (state, action) => {
                state.isLoading = false;
                state.mediaList = action.payload.items;
                state.total = action.payload.total;
                state.page = action.payload.page;
                state.pageSize = action.payload.pageSize;
            })
            .addCase(fetchMediaList.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Fetch media by ID
        builder
            .addCase(fetchMediaById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchMediaById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentMedia = action.payload;
            })
            .addCase(fetchMediaById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Fetch user media
        builder
            .addCase(fetchUserMedia.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUserMedia.fulfilled, (state, action) => {
                state.isLoading = false;
                state.userMedia = action.payload;
            })
            .addCase(fetchUserMedia.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Upload media
        builder
            .addCase(uploadMedia.pending, (state) => {
                state.isUploading = true;
                state.uploadProgress = 0;
                state.error = null;
            })
            .addCase(uploadMedia.fulfilled, (state, action) => {
                state.isUploading = false;
                state.uploadProgress = 100;
                state.mediaList.unshift(action.payload);
                state.total += 1;
            })
            .addCase(uploadMedia.rejected, (state, action) => {
                state.isUploading = false;
                state.uploadProgress = 0;
                state.error = action.payload as string;
            });

        // Update media
        builder
            .addCase(updateMedia.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateMedia.fulfilled, (state, action) => {
                state.isLoading = false;
                const { id, data } = action.payload;
                
                // Update in mediaList
                const mediaIndex = state.mediaList.findIndex((m) => m.mediaId === id);
                if (mediaIndex !== -1 && data.visibility) {
                    state.mediaList[mediaIndex].visibility = data.visibility;
                }
                
                // Update currentMedia
                if (state.currentMedia && state.currentMedia.mediaId === id && data.visibility) {
                    state.currentMedia.visibility = data.visibility;
                }
            })
            .addCase(updateMedia.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Delete media
        builder
            .addCase(deleteMedia.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteMedia.fulfilled, (state, action) => {
                state.isLoading = false;
                state.mediaList = state.mediaList.filter((m) => m.mediaId !== action.payload);
                state.userMedia = state.userMedia.filter((m) => m.mediaId !== action.payload);
                state.total = Math.max(0, state.total - 1);
                
                if (state.currentMedia && state.currentMedia.mediaId === action.payload) {
                    state.currentMedia = null;
                }
            })
            .addCase(deleteMedia.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Fetch presigned URL
        builder
            .addCase(fetchPresignedUrl.pending, (state) => {
                state.error = null;
            })
            .addCase(fetchPresignedUrl.fulfilled, (state) => {
                // URL sẽ được xử lý bởi component
            })
            .addCase(fetchPresignedUrl.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export const {
    clearError,
    clearCurrentMedia,
    clearUserMedia,
    setPage,
    setPageSize,
    setUploadProgress,
} = mediaSlice.actions;

export default mediaSlice.reducer;
