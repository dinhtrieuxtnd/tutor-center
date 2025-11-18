import { apiService } from "@/services";
import { API_ENDPOINTS } from "@/constants";
import { ApiResponse } from "@/types";

export interface JoinRequestResponse {
    joinRequestId: number;
    classroomId: number;
    studentId: number;
    status: 'pending' | 'accepted' | 'rejected';
    note?: string | null;
    requestedAt: string;
    handledBy?: number | null;
    handledAt?: string | null;
}

export interface CreateJoinRequestRequest {
    classroomId: number;
    studentId: number;
    note?: string;
}

export interface UpdateJoinRequestStatusRequest {
    status: 'accepted' | 'rejected';
    note?: string;
}

export const joinRequestApi = {
    // Student: Create new join request (POST /api/JoinRequests)
    // Tạo yêu cầu tham gia lớp học mới. Nếu đã có yêu cầu cũ (pending/denied/accepted), 
    // hệ thống sẽ tự động cập nhật thành pending thay vì tạo mới
    create: async (data: CreateJoinRequestRequest): Promise<ApiResponse<JoinRequestResponse>> => {
        return await apiService.post<ApiResponse<JoinRequestResponse>>(
            API_ENDPOINTS.joinRequests.create,
            data
        );
    },

    // Student: Get my join requests (GET /api/JoinRequests/my)
    // Lấy danh sách tất cả yêu cầu tham gia lớp học của sinh viên hiện tại
    getMy: async (): Promise<JoinRequestResponse[]> => {
        return await apiService.get<JoinRequestResponse[]>(
            API_ENDPOINTS.joinRequests.my
        );
    },

    // Tutor: Get join requests for a classroom (GET /api/JoinRequests/by-classroom/:classroomId)
    // Lấy danh sách yêu cầu tham gia của một lớp học cụ thể (chỉ giáo viên phụ trách mới được xem)
    getByClassroom: async (classroomId: number | string): Promise<ApiResponse<JoinRequestResponse[]>> => {
        return await apiService.get<ApiResponse<JoinRequestResponse[]>>(
            API_ENDPOINTS.joinRequests.getByClassroom(classroomId)
        );
    },

    // Tutor: Update join request status (PATCH /api/JoinRequests/:id/status)
    // Duyệt hoặc từ chối yêu cầu tham gia lớp học. Nếu duyệt (accepted), sinh viên sẽ được tự động thêm vào lớp
    // Returns: 204 No Content on success
    updateStatus: async (joinRequestId: number | string, data: UpdateJoinRequestStatusRequest): Promise<void> => {
        await apiService.patch<void>(
            API_ENDPOINTS.joinRequests.updateStatus(joinRequestId),
            data
        );
    },
};
