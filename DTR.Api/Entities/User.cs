namespace DTR.Api.Entities;

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
}