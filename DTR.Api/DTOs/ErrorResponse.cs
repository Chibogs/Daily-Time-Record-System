namespace DTR.Api.DTOs;

public class ErrorResponse
{
    public int StatusCode { get; set; }
    public string Error { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;

    //For development - never in production (stack trace)
    public String? Details { get; set; } = null;
}