export interface AttendanceResponse {
    id: number;
    studentId: number;
    studentName: string;
    timeIn: string;
    timeOut: string | null;
    totalHours: number | null;
    status: string;
    studentRemarks: string | null;
    adminRemarks: string | null;
    approvedByAdminName: string | null;
    approvedAt: string | null;
}

export interface TimeOutRequest {
    remarks?: string;
}