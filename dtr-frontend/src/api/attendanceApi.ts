import apiClient from "./axios";
import type {
    AttendanceResponse,
    TimeOutRequest,
} from "../types/attendance";

export const attendanceApi = {
    timeIn: async (): Promise<AttendanceResponse> => {
        const response = await apiClient.post<AttendanceResponse>(
            "/Attendance/time-in"
        );

        return response.data;
    },

    timeOut: async (
        request: TimeOutRequest
    ): Promise<AttendanceResponse> => {
        const response = await apiClient.post<AttendanceResponse>(
            "/Attendance/time-out",
            request
        );

        return response.data;
    },

    getStatus: async (): Promise<AttendanceResponse> => {
        const response = await apiClient.get<AttendanceResponse>(
            "/Attendance/status"
        );

        return response.data;
    },

    getHistory: async (): Promise<AttendanceResponse[]> => {
        const response = await apiClient.get<AttendanceResponse[]>(
            "/Attendance/history"
        );

        return response.data;
    },
};