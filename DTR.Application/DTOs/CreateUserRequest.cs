using System.ComponentModel.DataAnnotations;

namespace DTR.Application.DTOs;

public class CreateUserRequest
{
    [Required]
    [MaxLength(50, ErrorMessage = "Username cannot exceed 50 characters.")]
    public string Username { get; set; } = string.Empty;
    [Required]
    [MinLength(6, ErrorMessage = "Password must be at least 6 characters.")]
    public string Password { get; set; } = string.Empty;
    [Required]
    [MaxLength(100, ErrorMessage = "FullName cannot exceed 100 characters.")]
    public string FullName { get; set; } = string.Empty;
    [Required]
    [RegularExpression("^(Student|Admin)$", ErrorMessage = "Role must be either 'Student' or 'Admin'.")]
    public string Role { get; set; } = string.Empty; // "Student" or "Admin"
}