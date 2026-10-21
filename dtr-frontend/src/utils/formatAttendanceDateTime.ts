const attendanceDateTimeFormatter = new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Manila",
});

export function formatAttendanceDateTime(value: string | null): string {
    if (!value) return "N/A";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "N/A";

    return attendanceDateTimeFormatter.format(date);
}
