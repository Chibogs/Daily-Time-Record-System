namespace DTR.Application.DTOs;

public class AttendanceResponse
{
    // This is what the API sends BACK to the client.
    // Notice: no PasswordHash, no IsDeleted, no internal fields.
    public int Id { get; set; }
    public int StudentId { get; set; }
    public string StudentName { get; set; } = string.Empty;

    
    public DateTime TimeIn { get; set; }
    // Nullable because TimeOut may not have happened yet
    public DateTime? TimeOut { get; set; }

    // Nullable for the same reason — hours can't be computed until timed out
    public double? TotalHours { get; set; }

    public string Status { get; set; } = string.Empty; // "Present", "Pending", "Approved"

    public string? StudentRemarks { get; set; }

    public string? AdminRemarks { get; set; }

    public string? ApprovedByAdminName { get; set; }

    public DateTime? ApprovedAt { get; set; }

}