namespace DTR.Domain.Entities;

public class User
{
    public int Id { get; set; }

    public string Username { get; set; } = string.Empty;

    // Never store plain text passwords
    // Always store hashed passwords
    public string PasswordHash { get; set; } = string.Empty;

    // "Student" or "Admin"
    public string Role { get; set; } = string.Empty;

    // Full name — used in attendance records
    public string FullName { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property for the attendance records associated with the user
    // This allows for easy access to a user's attendance records when querying the database
    // one-to-many relationship: one user can have many attendance records
    public ICollection<AttendanceRecord> AttendanceRecords { get; set; } = new List<AttendanceRecord>();
}