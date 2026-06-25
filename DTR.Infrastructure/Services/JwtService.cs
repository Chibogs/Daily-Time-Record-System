using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using DTR.Application.Interfaces;
using DTR.Domain.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DTR.Infrastructure.Services;

public class JwtService : IJwtService
{
    private readonly IConfiguration _configuration;

    //Iconfiguration is injected to access appsettings.json
    public JwtService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string GenerateToken(User user)
    {

    // Step 1: Retrieve JWT settings from configuration (appsettings.json)   
    var secretKey = _configuration["JwtSettings:SecretKey"]!;
    var issuer = _configuration["JwtSettings:Issuer"]!;
    var audience = _configuration["JwtSettings:Audience"]!;
    var expirationMinutes = int.Parse(_configuration["JwtSettings:ExpirationMinutes"]!);

    // Step 2: Create the signing key and credentials

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
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
        issuer: issuer,
        audience: audience,
        claims: claims,
        expires: DateTime.UtcNow.AddMinutes(expirationMinutes),
        signingCredentials: credentials
    );

    // Step 5: Return the serialized token string
    // We return to the client
    return new JwtSecurityTokenHandler().WriteToken(token);
    }
}