export function formatDurationHours(hours: number | null): string {
    if (hours === null || !Number.isFinite(hours) || hours < 0) return "-";

    const totalMinutes = Math.round(hours * 60);
    if (totalMinutes === 0) return "0 mins";

    const wholeHours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const parts: string[] = [];

    if (wholeHours > 0) {
        parts.push(`${wholeHours} hr${wholeHours === 1 ? "" : "s"}`);
    }

    if (minutes > 0) {
        parts.push(`${minutes} min${minutes === 1 ? "" : "s"}`);
    }

    return parts.join(" ");
}
