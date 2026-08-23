import { attendanceApi } from "../api/attendanceApi";
import type {
    AttendanceResponse,
    TimeOutRequest,
} from "../types/attendance";

export const attendanceService = {
    async timeIn(): Promise<AttendanceResponse> {
        return attendanceApi.timeIn();
    },

    async timeOut(
        request: TimeOutRequest
    ): Promise<AttendanceResponse> {
        return attendanceApi.timeOut(request);
    },

    async getStatus(): Promise<AttendanceResponse> {
        return attendanceApi.getStatus();
    },

    async getHistory(): Promise<AttendanceResponse[]> {
        return attendanceApi.getHistory();
    },
};