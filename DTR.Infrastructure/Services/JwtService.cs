using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using DTR.Application.Interfaces;
using DTR.Application.Settings;
using DTR.Domain.Entities;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace DTR.Infrastructure.Services;

public class JwtService : IJwtService
{
    private readonly JwtSettings _jwtSettings;

    // IOptions<JwtSettings> — dependency injection ang bahala
    // na i-populate ito gamit ang binded configuration
    public JwtService(IOptions<JwtSettings> options)
    {
        _jwtSettings = options.Value;
    }

    public string GenerateToken(User user)
    {

    // Step 1: Retrieve JWT settings from configuration (appsettings.json)   


    // Step 2: Create the signing key and credentials

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey));
    var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    // Step 3: Define the claims for the JWT token (payload)

    var claims = new[]
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Name, user.Username),
        new Claim(ClaimTypes.Role, user.Role),
        new Claim("fullName", user.FullName)
    };

    // Step 4: Create the JWT token

    var token = new JwtSecurityToken(
        issuer: _jwtSettings.Issuer,
        audience: _jwtSettings.Audience,
        claims: claims,
        expires: DateTime.UtcNow.AddMinutes(_jwtSettings.ExpirationMinutes),
        signingCredentials: credentials
    );

    // Step 5: Return the serialized token string
    // We return to the client
    return new JwtSecurityTokenHandler().WriteToken(token);
    }
}