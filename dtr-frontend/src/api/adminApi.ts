import apiClient from './axios';
import type{ ApprovalActionsRequest, AdminUser } from '../types/admin';
import type { AttendanceResponse } from '../types/attendance';

export const adminApi = {
    getPendingTimeoutRequests: async (): Promise<AttendanceResponse[]> => {
        const response = await apiClient.get<AttendanceResponse[]>('/admin/pending-timeout-requests');
        return response.data;
    },

    approve: async (id: number, request: ApprovalActionsRequest): Promise<AttendanceResponse> => {
        const response = await apiClient.post<AttendanceResponse>(`/admin/approve/${id}`, request);
        return response.data;
    },

    reject: async(id: number, request: ApprovalActionsRequest): Promise<AttendanceResponse> => {
        const response = await apiClient.post<AttendanceResponse>(`/admin/reject/${id}`, request);
        return response.data;
    },

    createUser: async(request: {
        username: string;
        password: string;
        fullName: string;
        role: string;
    }): Promise<AdminUser> => {
        const response = await apiClient.post<AdminUser>('/admin/create-user', request);
        return response.data;   
    },

    deactivateUser: async(userId: number): Promise<AdminUser> => {
        const response = await apiClient.post<AdminUser>(`/admin/deactivate-user/${userId}`);
        return response.data;
    },

    getAllUsers: async(): Promise<AdminUser[]> => {
        const response = await apiClient.get<AdminUser[]>('/admin/all-users');
        return response.data;
    }
}