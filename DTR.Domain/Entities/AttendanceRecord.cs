namespace DTR.Domain.Entities;

public class AttendanceRecord
{
    // EF Core convention: property named "Id" = primary key automatically
    public int Id { get; set; }

    // Foreign key — connects to a Student table later
    public int StudentId { get; set; }

    // Required string — EF Core maps this to NOT NULL in the database
    public string StudentName { get; set; } = string.Empty;

    public DateTime TimeIn { get; set; }

    // Nullable — no value until student times out
    public DateTime? TimeOut { get; set; }

    // Nullable — computed only after TimeOut exists
    public double? TotalHours { get; set; }

    // "Present", "Pending", "Approved", "Rejected"
    public string Status { get; set; } = string.Empty;

    // Audit fields — standard in production systems
    // Tells you when the record was created, never changes after
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public string? StudentRemarks { get; set; }

    public string? AdminRemarks { get; set; }

    public int? ApprovedByAdminId { get; set; }

    public DateTime? ApprovedAt { get; set; }

}