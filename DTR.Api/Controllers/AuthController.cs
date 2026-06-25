using DTR.Application.DTOs;
using DTR.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace DTR.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var response = await _authService.LoginAsync(request);

        // if null = invalid credentials
        // We return 401 Unauthorized for invalid credentials. This is standard practice for authentication failures.
        if (response == null)
        {
            return Unauthorized(new { error = "Invalid username or password" });
        }
        return Ok(response);
    }
}