import { useEffect, useState } from "react";
import { attendanceService } from "../services/attendanceService";
import type { AttendanceResponse } from "../types/attendance";
import {getErrorMessage} from "../utils/getErrorMessage";

export default function AttendancePage() {
    const [attendance, setAttendance] =
        useState<AttendanceResponse | null>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [remarks, setRemarks] = useState("");

    useEffect(() => {
        const loadStatus = async () => {
            try {
                setLoading(true);

                const result = await attendanceService.getStatus();

                setAttendance(result);
            } catch (err) {
                console.error(err);
                setError(getErrorMessage(err, "Failed to load attendance status."));
            } finally {
                setLoading(false);
            }
        };

        loadStatus();
    }, []);

    const handleTimeIn = async () => {
        try {
            setLoading(true);
            setError(null);

            const result = await attendanceService.timeIn();

            setAttendance(result);
        } catch (err) {
            console.error(err);
            setError(getErrorMessage(err, "Failed to time in."));
        } finally {
            setLoading(false);
        }
    };

    const handleTimeOut = async () => {
        try {
            setLoading(true);
            setError(null);

            const result = await attendanceService.timeOut({ remarks: remarks || undefined});
            
            setAttendance(result);
        } catch (err) {
            console.error(err);
            setError(getErrorMessage(err, "Failed to time out."));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="attendance-page">
            <section className="page-heading">
                <div>
                    <p className="page-eyebrow">Student workspace</p>
                    <h1>Attendance</h1>
                    <p className="page-description">
                        Record your workday and keep your daily time entry up to date.
                    </p>
                </div>
                {attendance && (
                    <span className="attendance-status-badge">
                        {attendance.status}
                    </span>
                )}
            </section>

            {loading && !attendance && (
                <div className="loading-panel" role="status">
                    <span className="loading-indicator" aria-hidden="true" />
                    Loading attendance...
                </div>
            )}

            {attendance?.status === "Not Timed In" && (
                <section className="attendance-action-panel">
                    <div>
                        <p className="panel-eyebrow">Start your workday</p>
                        <h2>You have not timed in yet.</h2>
                        <p>Record your arrival time when you are ready to begin.</p>
                    </div>
                    <button
                        onClick={handleTimeIn}
                        disabled={loading}
                        className="attendance-primary-button"
                    >
                        {loading ? "Processing..." : "Time In"}
                        <span aria-hidden="true">&#8594;</span>
                    </button>
                </section>
            )}

            {error && (
                <p className="attendance-error" role="alert">
                    {error}
                </p>
            )}

            {attendance?.status === "Present" && !attendance.timeOut && (
                <section className="attendance-action-panel attendance-action-panel-active">
                    <div>
                        <p className="panel-eyebrow">Workday in progress</p>
                        <h2>You are currently timed in.</h2>
                        <p>Add an optional note before submitting your time-out request.</p>
                    </div>

                    <div className="timeout-controls">
                        <label htmlFor="remarks">Remarks <span>(optional)</span></label>
                        <textarea
                            id="remarks"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            maxLength={250}
                            placeholder="Add a note about your workday..."
                            rows={3}
                        />
                        <button
                            onClick={handleTimeOut}
                            disabled={loading}
                            className="attendance-timeout-button"
                        >
                            {loading ? "Processing..." : "Time Out"}
                        </button>
                    </div>
                </section>
            )}

            {attendance?.status === "Pending" && (
                <div className="attendance-notice notice-pending" role="status">
                    <span className="notice-icon" aria-hidden="true">!</span>
                    <div>
                        <strong>Time-out request pending</strong>
                        <p>Your time-out request is waiting for admin approval.</p>
                    </div>
                </div>
            )}

            {attendance?.status === "Approved" && (
                <div className="attendance-notice notice-approved" role="status">
                    <span className="notice-icon" aria-hidden="true">&#10003;</span>
                    <div>
                        <strong>Attendance approved</strong>
                        <p>Your attendance record has been approved by an administrator.</p>
                    </div>
                </div>
            )}

            {attendance?.status === "Rejected" && (
                <div className="attendance-notice notice-rejected" role="alert">
                    <span className="notice-icon" aria-hidden="true">!</span>
                    <div>
                        <strong>Time-out request rejected</strong>
                        <p>Your time-out request needs attention before it can be completed.</p>

                        {attendance.adminRemarks && (
                            <p className="notice-detail">
                                <strong>Admin remarks:</strong>{" "}
                                {attendance.adminRemarks}
                            </p>
                        )}
                    </div>
                </div>
            )}

            {attendance && (
                <section className="attendance-details">
                    <div className="section-heading">
                        <div>
                            <p className="page-eyebrow">Record details</p>
                            <h2>Today&apos;s attendance</h2>
                        </div>
                    </div>

                    <div className="attendance-detail-grid">
                        <div className="detail-item">
                            <span>Student</span>
                            <strong>{attendance.studentName}</strong>
                        </div>
                        <div className="detail-item">
                            <span>Status</span>
                            <strong>{attendance.status}</strong>
                        </div>
                        <div className="detail-item">
                            <span>Time in</span>
                            <strong>{attendance.status === "Not Timed In" ? "Not yet timed in" : attendance.timeIn}</strong>
                        </div>
                        <div className="detail-item">
                            <span>Time out</span>
                            <strong>{attendance.timeOut ?? "Not yet timed out"}</strong>
                        </div>
                        <div className="detail-item">
                            <span>Total hours</span>
                            <strong>{attendance.totalHours !== null ? attendance.totalHours.toFixed(2) : "Not available"}</strong>
                        </div>
                        {attendance.studentRemarks && (
                            <div className="detail-item detail-item-wide">
                                <span>Remarks</span>
                                <strong>{attendance.studentRemarks}</strong>
                            </div>
                        )}
                    </div>
                </section>
            )}
        </div>
    );
}