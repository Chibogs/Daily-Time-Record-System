import { useEffect, useState } from "react";
import { adminService } from "../services/adminService";
import type { AttendanceResponse } from "../types/attendance";
import { getErrorMessage } from "../utils/getErrorMessage";
import { formatAttendanceDateTime } from "../utils/formatAttendanceDateTime";

export default function AdminAttendancePage() {
    const [requests, setRequests] = useState<AttendanceResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Stores the admin remark for each attendance record
    const [remarks, setRemarks] = useState<Record<number, string>>({});

    const loadRequests = async () => {
        try {
            setLoading(true);
            setError(null);

            const result = await adminService.getPendingTimeoutRequests();

            setRequests(result);
        } catch (err) {
            console.error(err);
            setError(getErrorMessage(err, "Failed to load pending requests."));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Defer the stateful loader to avoid a synchronous state update inside the effect.
        const loadTimer = window.setTimeout(() => {
            void loadRequests();
        }, 0);

        // Do not start the request if the page unmounts before the scheduled load runs.
        return () => window.clearTimeout(loadTimer);
    }, []);

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

        const confirmed = window.confirm(
            "Are you sure you want to approve this request?"
        );

        if (!confirmed) return;

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
            setError(getErrorMessage(err, "Failed to approve request."));
        }
    };

    const handleReject = async (id: number) => {
        const confirmed = window.confirm(
            "Are you sure you want to reject this request?"
        );

        if (!confirmed) return;

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
            setError(getErrorMessage(err, "Failed to reject request."));
        }
    };

    if (loading) {
        return (
            <div className="admin-requests-page">
                <section className="page-heading">
                    <div>
                        <p className="page-eyebrow">Administration</p>
                        <h1>Attendance requests</h1>
                        <p className="page-description">
                            Review and process pending time-out requests.
                        </p>
                    </div>
                </section>
                <div className="loading-panel" role="status">
                    <span className="loading-indicator" aria-hidden="true" />
                    Loading pending requests...
                </div>
            </div>
        );
    }

    return (
        <div className="admin-requests-page">
            <section className="page-heading">
                <div>
                    <p className="page-eyebrow">Administration</p>
                    <h1>Attendance requests</h1>
                    <p className="page-description">
                        Review and process pending time-out requests.
                    </p>
                </div>
                <span className="request-count">
                    {requests.length} pending
                </span>
            </section>

            {error && (
                <p className="attendance-error" role="alert">
                    {error}
                </p>
            )}

            {requests.length === 0 ? (
                <div className="history-empty-state request-empty-state">
                    <span className="empty-mark" aria-hidden="true">&#10003;</span>
                    <h2>All requests are up to date</h2>
                    <p>No pending attendance requests need your attention.</p>
                </div>
            ) : (
                <div className="request-list">
                    {requests.map((request) => (
                        <article key={request.id} className="request-card">
                            <div className="request-card-heading">
                                <div>
                                    <p className="request-kicker">Time-out request</p>
                                    <h2>{request.studentName}</h2>
                                </div>
                                <span className="history-status history-status-pending">
                                    {request.status}
                                </span>
                            </div>

                            <div className="request-summary-grid">
                                <div className="request-summary-item">
                                    <span>Time in</span>
                                    <strong>{formatAttendanceDateTime(request.timeIn)}</strong>
                                </div>
                                <div className="request-summary-item">
                                    <span>Time out</span>
                                    <strong>{formatAttendanceDateTime(request.timeOut)}</strong>
                                </div>
                                <div className="request-summary-item">
                                    <span>Total hours</span>
                                    <strong>{request.totalHours !== null ? request.totalHours.toFixed(2) : "N/A"}</strong>
                                </div>
                            </div>

                            {request.studentRemarks && (
                                <div className="student-remark">
                                    <span>Student remarks</span>
                                    <p>{request.studentRemarks}</p>
                                </div>
                            )}

                            <div className="request-decision">
                                <div className="request-remarks-field">
                                    <label htmlFor={`remarks-${request.id}`}>
                                        Admin remarks <span>(optional)</span>
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
                                        placeholder="Add a note for the student..."
                                        rows={3}
                                    />
                                </div>

                                <div className="request-actions">
                                <button
                                    onClick={() =>
                                        handleReject(request.id)
                                    }
                                    className="request-reject-button"
                                >
                                    Reject
                                </button>

                                <button
                                    onClick={() =>
                                        handleApprove(request.id)
                                    }
                                    className="request-approve-button"
                                >
                                    Approve
                                </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}
