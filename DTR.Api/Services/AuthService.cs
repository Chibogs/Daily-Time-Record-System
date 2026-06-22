using DTR.Api.Data;
using DTR.Api.DTOs;
using Microsoft.EntityFrameworkCore;

namespace DTR.Api.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context; 
    private readonly IJwtService _jwtService;

    public AuthService(AppDbContext context, IJwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    public async Task<LoginResponse?> LoginAsync(LoginRequest request)
    {
        // Step 1 - Find user by username

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == request.Username);
        

        // Step 2 - Return null if user not found or password does not match
        // Never say "user not found" or "password incorrect" to avoid giving hints to attacker
        // ALways say "Invalid credentials"

        if (user == null)
        {
            return null;
        }

        // Step 3 - Verify password

        // Mas clean
        var isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);

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