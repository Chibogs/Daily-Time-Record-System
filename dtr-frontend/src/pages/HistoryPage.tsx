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
            <div className="p-6">
                <h1 className="text-2xl font-bold">
                    Attendance History
                </h1>

                <p className="mt-4 text-gray-600">
                    Loading attendance history...
                </p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">
                Attendance History
            </h1>

            {error && (
                <p className="mt-4 text-red-600">
                    {error}
                </p>
            )}

            {!error && history.length === 0 && (
                <p className="mt-4 text-gray-600">
                    No attendance records found.
                </p>
            )}

            {history.length > 0 && (
                <div className="mt-6 overflow-x-auto rounded border">
                    <table className="w-full text-left">
                        <thead className="border-b bg-gray-100">
                            <tr>
                                <th className="p-3">Date</th>
                                <th className="p-3">Time In</th>
                                <th className="p-3">Time Out</th>
                                <th className="p-3">Total Hours</th>
                                <th className="p-3">Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {history.map((record) => (
                                <tr
                                    key={record.id}
                                    className="border-b"
                                >
                                    <td className="p-3">
                                        {record.timeIn
                                            ? new Date(
                                                  record.timeIn
                                              ).toLocaleDateString()
                                            : "-"}
                                    </td>

                                    <td className="p-3">
                                        {record.timeIn
                                            ? new Date(
                                                  record.timeIn
                                              ).toLocaleTimeString()
                                            : "-"}
                                    </td>

                                    <td className="p-3">
                                        {record.timeOut
                                            ? new Date(
                                                  record.timeOut
                                              ).toLocaleTimeString()
                                            : "-"}
                                    </td>

                                    <td className="p-3">
                                        {record.totalHours !== null
                                            ? record.totalHours.toFixed(2)
                                            : "-"}
                                    </td>

                                    <td className="p-3">
                                        {record.status}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}