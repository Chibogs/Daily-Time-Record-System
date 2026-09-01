import { adminApi } from '../api/adminApi';
import type { ApprovalActionsRequest, AdminUser } from '../types/admin';
import type { AttendanceResponse } from '../types/attendance';

export const adminService = {
    async getPendingTimeoutRequests(): Promise<AttendanceResponse[]>{
        return await adminApi.getPendingTimeoutRequests();
    },

    async approve(id: number, request: ApprovalActionsRequest): Promise<AttendanceResponse>{
        return adminApi.approve(id, request);
    },

    async reject(id: number, request: ApprovalActionsRequest): Promise<AttendanceResponse>{
        return adminApi.reject(id, request);
    },

    async createUser(request: {
        username: string;
        password: string;
        fullName: string;
        role: string;
    }): Promise<AdminUser>{
        return adminApi.createUser(request);
    },

    async deactivateUser(userId: number): Promise<AdminUser> {
        return adminApi.deactivateUser(userId);
    },

    async getAllUsers(): Promise<AdminUser[]> {
        return adminApi.getAllUsers();
    },

}