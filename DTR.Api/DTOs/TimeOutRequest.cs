using System.ComponentModel.DataAnnotations;
namespace DTR.Api.DTOs;

public class TimeOutRequest
{
    // StudentId tells us whose time-out request this is.
    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "StudentId must be a positive integer.")]
    public int StudentId { get; set; }

    // Optional note — student can explain why they're leaving early.
    // The "?" makes this nullable. If the client doesn't send it, it's null.
    [StringLength(250, ErrorMessage = "Remarks cannot exceed 250 characters.")]
    public string? Remarks { get; set; }
}