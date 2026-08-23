import { useEffect, useState } from "react";
import { attendanceService } from "../services/attendanceService";
import type { AttendanceResponse } from "../types/attendance";

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
                setError("Failed to load attendance status.");
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
            setError("Failed to time in.");
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
            setError("Failed to time out.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h1 className="mb-4 text-2xl font-bold">
                Attendance
            </h1>

            {attendance?.status === "Not Timed In" && (
                <button
                    onClick={handleTimeIn}
                    disabled={loading}
                    className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
                >
                    {loading ? "Processing..." : "Time In"}
                </button>
            )}

            {error && (
                <p className="mt-4 text-red-600">
                    {error}
                </p>
            )}

            {attendance?.status === "Present" && !attendance.timeOut && (
                <div className="mt-6">
                    <label
                        htmlFor="remarks"
                        className="mb-2 block font-medium"
                    >
                        Remarks
                    </label>

                    <textarea
                        id="remarks"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        maxLength={250}
                        placeholder="Optional remarks..."
                        className="w-full max-w-md rounded border p-2"
                        rows={3}
                    />

                    <button
                        onClick={handleTimeOut}
                        disabled={loading}
                        className="mt-3 rounded bg-red-600 px-4 py-2 text-white disabled:opacity-50"
                    >
                        {loading ? "Processing..." : "Time Out"}
                    </button>
                </div>
            )}

            {attendance && (
                <div className="mt-6 rounded border p-4">
                    <p>
                        <strong>Student:</strong>{" "}
                        {attendance.studentName}
                    </p>

                    <p>
                        <strong>Time In:</strong>{" "}
                        {attendance.status === "Not Timed In"
                            ? "Not yet timed in"
                            : attendance.timeIn}
                    </p>

                    <p>
                        <strong>Time Out:</strong>{" "}
                        {attendance.timeOut ?? "Not yet timed out"}
                    </p>

                    <p>
                        <strong>Total Hours:</strong>{" "}
                        {attendance.totalHours !== null
                            ? attendance.totalHours.toFixed(2)
                            : "Not available"}
                    </p>

                    <p>
                        <strong>Status:</strong>{" "}
                        {attendance.status}
                    </p>

                    {attendance.studentRemarks && (
                        <p>
                            <strong>Remarks:</strong>{" "}
                            {attendance.studentRemarks}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}