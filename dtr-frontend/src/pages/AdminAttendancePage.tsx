import { useEffect, useState } from "react";
import { adminService } from "../services/adminService";
import type { AttendanceResponse } from "../types/attendance";

export default function AdminAttendancePage() {
    const [requests, setRequests] = useState<AttendanceResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        try {
            setLoading(true);
            setError(null);

            const result =
                await adminService.getPendingTimeoutRequests();

            setRequests(result);
        } catch (err) {
            console.error(err);
            setError("Failed to load pending requests.");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: number) => {
        try {
            await adminService.approve(id, {});

            // Remove approved request from the pending list
            setRequests((current) =>
                current.filter((request) => request.id !== id)
            );
        } catch (err) {
            console.error(err);
            setError("Failed to approve request.");
        }
    };

    const handleReject = async (id: number) => {
        try {
            await adminService.reject(id, {});

            // Remove rejected request from the pending list
            setRequests((current) =>
                current.filter((request) => request.id !== id)
            );
        } catch (err) {
            console.error(err);
            setError("Failed to reject request.");
        }
    };

    if (loading) {
        return <p className="p-6">Loading pending requests...</p>;
    }

    return (
        <div className="p-6">
            <h1 className="mb-6 text-2xl font-bold">
                Attendance Requests
            </h1>

            {error && (
                <p className="mb-4 text-red-600">
                    {error}
                </p>
            )}

            {requests.length === 0 ? (
                <p>No pending time-out requests.</p>
            ) : (
                <div className="space-y-4">
                    {requests.map((request) => (
                        <div
                            key={request.id}
                            className="rounded border p-4"
                        >
                            <p>
                                <strong>Student:</strong>{" "}
                                {request.studentName}
                            </p>

                            <p>
                                <strong>Time In:</strong>{" "}
                                {request.timeIn}
                            </p>

                            <p>
                                <strong>Time Out:</strong>{" "}
                                {request.timeOut}
                            </p>

                            <p>
                                <strong>Total Hours:</strong>{" "}
                                {request.totalHours?.toFixed(2)}
                            </p>

                            <p>
                                <strong>Status:</strong>{" "}
                                {request.status}
                            </p>

                            {request.studentRemarks && (
                                <p>
                                    <strong>Student Remarks:</strong>{" "}
                                    {request.studentRemarks}
                                </p>
                            )}

                            <div className="mt-4 flex gap-2">
                                <button
                                    onClick={() =>
                                        handleApprove(request.id)
                                    }
                                    className="rounded bg-green-600 px-4 py-2 text-white"
                                >
                                    Approve
                                </button>

                                <button
                                    onClick={() =>
                                        handleReject(request.id)
                                    }
                                    className="rounded bg-red-600 px-4 py-2 text-white"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}