using System.ComponentModel.DataAnnotations;
namespace DTR.Api.DTOs;

public class TimeOutRequest
{
    // Optional note — student can explain why they're leaving early.
    // The "?" makes this nullable. If the client doesn't send it, it's null.
    [StringLength(250, ErrorMessage = "Remarks cannot exceed 250 characters.")]
    public string? Remarks { get; set; }
}