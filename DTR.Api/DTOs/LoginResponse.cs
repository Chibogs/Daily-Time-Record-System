namespace DTR.Api.DTOs;

public class LoginResponse
{
    // The JWT token that the client will use for authenticated requests
    public string Token { get; set; } = string.Empty;

    public string Username { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;

    // The expiration time of the token — useful for the client to know when to refresh
    public DateTime ExpiresAt { get; set; }
}