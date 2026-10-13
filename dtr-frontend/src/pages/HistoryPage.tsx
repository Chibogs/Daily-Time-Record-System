import { useEffect, useState } from "react";
import { attendanceService } from "../services/attendanceService";
import type { AttendanceResponse } from "../types/attendance";
import { getErrorMessage } from "../utils/getErrorMessage";

export default function HistoryPage() {
    const [history, setHistory] = useState<AttendanceResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadHistory = async () => {
            try {
                setLoading(true);
                setError(null);

                const result = await attendanceService.getHistory();

                setHistory(result);
            } catch (err) {
                console.error(err);
                setError(
                    getErrorMessage(
                        err,
                        "Failed to load attendance history."
                    )
                );
            } finally {
                setLoading(false);
            }
        };

        loadHistory();
    }, []);

    if (loading) {
        return (
            <div className="history-page">
                <section className="page-heading">
                    <div>
                        <p className="page-eyebrow">Student workspace</p>
                        <h1>Attendance history</h1>
                        <p className="page-description">
                            Review your previous attendance records and hours.
                        </p>
                    </div>
                </section>
                <div className="loading-panel" role="status">
                    <span className="loading-indicator" aria-hidden="true" />
                    Loading attendance history...
                </div>
            </div>
        );
    }

    return (
        <div className="history-page">
            <section className="page-heading">
                <div>
                    <p className="page-eyebrow">Student workspace</p>
                    <h1>Attendance history</h1>
                    <p className="page-description">
                        Review your previous attendance records and hours.
                    </p>
                </div>
                {history.length > 0 && (
                    <span className="history-count">
                        {history.length} {history.length === 1 ? "record" : "records"}
                    </span>
                )}
            </section>

            {error && (
                <p className="attendance-error" role="alert">
                    {error}
                </p>
            )}

            {!error && history.length === 0 && (
                <div className="history-empty-state">
                    <span className="empty-mark" aria-hidden="true">--</span>
                    <h2>No attendance records yet</h2>
                    <p>Your completed attendance entries will appear here.</p>
                </div>
            )}

            {history.length > 0 && (
                <div className="history-table-wrap">
                    <div className="history-table-scroll">
                        <table className="history-table">
                            <thead>
                            <tr>
                                <th>Date</th>
                                <th>Time in</th>
                                <th>Time out</th>
                                <th>Total hours</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {history.map((record) => (
                                    <tr key={record.id}>
                                    <td className="history-date-cell">
                                        {record.timeIn
                                            ? new Date(
                                                  record.timeIn
                                              ).toLocaleDateString()
                                            : "-"}
                                    </td>

                                    <td>
                                        {record.timeIn
                                            ? new Date(
                                                  record.timeIn
                                              ).toLocaleTimeString()
                                            : "-"}
                                    </td>

                                    <td>
                                        {record.timeOut
                                            ? new Date(
                                                  record.timeOut
                                              ).toLocaleTimeString()
                                            : "-"}
                                    </td>

                                    <td className="history-hours-cell">
                                        {record.totalHours !== null
                                            ? record.totalHours.toFixed(2)
                                            : "-"}
                                    </td>

                                    <td>
                                        <span className={`history-status history-status-${record.status.toLowerCase()}`}>
                                            {record.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}