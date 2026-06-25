using DTR.Application.DTOs;

namespace DTR.Application.Interfaces;

public interface IAuthService
{
    Task<LoginResponse?> LoginAsync(LoginRequest request);
}