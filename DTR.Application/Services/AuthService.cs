using DTR.Application.DTOs;
using DTR.Application.Interfaces;


namespace DTR.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtService _jwtService;

    public AuthService(IUserRepository userRepository, IJwtService jwtService)
    {
        _userRepository = userRepository;
        _jwtService = jwtService;
    }

    public async Task<LoginResponse?> LoginAsync(LoginRequest request)
    {
        // Step 1 - Find user by username

        var user = await _userRepository.GetByUsernameAsync(request.Username);
        

        // Step 2 - Return null if user not found or password does not match
        // Never say "user not found" or "password incorrect" to avoid giving hints to attacker
        // ALways say "Invalid credentials"

        if (user == null)
        {
            return null;
        }

        // Step 3 - Verify password
        var isPasswordValid = await _userRepository.VerifyPasswordAsync(user, request.Password);

        if (!isPasswordValid)
        {
            return null;
        }

        // Step 4 - Generate JWT token

        var token = _jwtService.GenerateToken(user);

        // Step 5 - Return the token and user info in the response

        return new LoginResponse
        {
            Token = token,
            Username = user.Username,
            FullName = user.FullName,
            Role = user.Role,
            ExpiresAt = DateTime.UtcNow.AddMinutes(60)
        };
    }
}