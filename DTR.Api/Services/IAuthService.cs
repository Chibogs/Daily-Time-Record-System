using DTR.Api.DTOs;

namespace DTR.Api.Services;

public interface IAuthService
{
    Task<LoginResponse?> LoginAsync(LoginRequest request);
}