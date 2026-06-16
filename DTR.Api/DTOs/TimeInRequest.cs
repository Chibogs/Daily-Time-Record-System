using System.ComponentModel.DataAnnotations;

namespace DTR.Api.DTOs;

public class TimeInRequest
{
    // The student sends only their ID when clocking in.
    // We don't trust the client to send their own name or role —
    // we'll look those up from the database using this ID.

    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "StudentId must be a positive integer.")]
    public int StudentId { get; set; }
}