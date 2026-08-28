import { useEffect, useState } from "react";
import { adminService } from "../services/adminService";
import type { AttendanceResponse } from "../types/attendance";

export default function AdminAttendancePage() {
    const [requests, setRequests] = useState<AttendanceResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Stores the admin remark for each attendance record
    const [remarks, setRemarks] = useState<Record<number, string>>({});

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        try {
            setLoading(true);
            setError(null);

            const result = await adminService.getPendingTimeoutRequests();

            setRequests(result);
        } catch (err) {
            console.error(err);
            setError("Failed to load pending requests.");
        } finally {
            setLoading(false);
        }
    };

    const handleRemarkChange = (
        id: number,
        value: string
    ) => {
        setRemarks((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleApprove = async (id: number) => {
        try {
            await adminService.approve(id, {
                adminRemarks: remarks[id] || undefined,
            });

            // Remove approved request from the pending list
            setRequests((prev) =>
                prev.filter((request) => request.id !== id)
            );
        } catch (err) {
            console.error(err);
            setError("Failed to approve request.");
        }
    };

    const handleReject = async (id: number) => {
        try {
            await adminService.reject(id, {
                adminRemarks: remarks[id] || undefined,
            });

            // Remove rejected request from the pending list
            setRequests((prev) =>
                prev.filter((request) => request.id !== id)
            );
        } catch (err) {
            console.error(err);
            setError("Failed to reject request.");
        }
    };

    if (loading) {
        return (
            <div className="p-6">
                Loading pending requests...
            </div>
        );
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
                <p>No pending attendance requests.</p>
            ) : (
                <div className="space-y-4">
                    {requests.map((request) => (
                        <div
                            key={request.id}
                            className="rounded border p-5"
                        >
                            <h2 className="mb-3 text-lg font-semibold">
                                {request.studentName}
                            </h2>

                            <p>
                                <strong>Time In:</strong>{" "}
                                {request.timeIn}
                            </p>

                            <p>
                                <strong>Time Out:</strong>{" "}
                                {request.timeOut ?? "N/A"}
                            </p>

                            <p>
                                <strong>Total Hours:</strong>{" "}
                                {request.totalHours !== null
                                    ? request.totalHours.toFixed(2)
                                    : "N/A"}
                            </p>

                            <p>
                                <strong>Status:</strong>{" "}
                                {request.status}
                            </p>

                            {request.studentRemarks && (
                                <p className="mt-2">
                                    <strong>
                                        Student Remarks:
                                    </strong>{" "}
                                    {request.studentRemarks}
                                </p>
                            )}

                            {/* Admin Remarks */}
                            <div className="mt-4">
                                <label
                                    htmlFor={`remarks-${request.id}`}
                                    className="mb-2 block font-medium"
                                >
                                    Admin Remarks
                                </label>

                                <textarea
                                    id={`remarks-${request.id}`}
                                    value={remarks[request.id] ?? ""}
                                    onChange={(e) =>
                                        handleRemarkChange(
                                            request.id,
                                            e.target.value
                                        )
                                    }
                                    maxLength={250}
                                    placeholder="Optional admin remarks..."
                                    rows={3}
                                    className="w-full max-w-md rounded border p-2"
                                />
                            </div>

                            {/* Actions */}
                            <div className="mt-4 flex gap-3">
                                <button
                                    onClick={() =>
                                        handleReject(request.id)
                                    }
                                    className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                                >
                                    Reject
                                </button>

                                <button
                                    onClick={() =>
                                        handleApprove(request.id)
                                    }
                                    className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                                >
                                    Approve
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}