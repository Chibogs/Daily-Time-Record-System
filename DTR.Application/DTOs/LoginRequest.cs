using System.ComponentModel.DataAnnotations;

namespace DTR.Application.DTOs;

public class LoginRequest
{
    [Required]
    [MaxLength(50)]
    public string Username { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}