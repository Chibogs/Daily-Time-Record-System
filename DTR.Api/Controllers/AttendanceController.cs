using System.Security.Claims;
using DTR.Application.DTOs;
using DTR.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DTR.Api.Controllers;

// [ApiController] does three things automatically:
// 1. Enables automatic model validation (returns 400 if request is invalid)
// 2. Enables binding source inference ([FromBody], [FromQuery] without needing to type them)
// 3. Returns ProblemDetails format on errors (industry standard error shape)
[ApiController]

// [Route] defines the base URL for all actions in this controller.
// [controller] is a token that gets replaced by the class name minus "Controller"
// So "AttendanceController" becomes "/api/attendance"
[Route("api/[controller]")]
[Authorize] // This attribute ensures that all endpoints in this controller require token. If a request is made without a valid token, it will return 401 Unauthorized.
public class AttendanceController : ControllerBase
{
    private readonly IAttendanceService _attendanceService;

    public AttendanceController(IAttendanceService attendanceService)
    {
        _attendanceService = attendanceService;
    }

    // ControllerBase vs Controller:
    // - ControllerBase: For APIs. No View support.
    // - Controller: For MVC with Razor Views. We don't need Views in a Web API.
    // Always use ControllerBase for Web APIs.


    [HttpPost("time-in")]
    [Authorize(Roles = "Student")] 
    public async Task<IActionResult> TimeIn()
    {
        // [FromBody] tells ASP.NET Core to read the JSON request body
        // and deserialize it into a TimeInRequest object.
        // With [ApiController], [FromBody] is inferred — but being explicit
        // is cleaner and easier to read for your teammates.


        // Read userId from JWT token — hindi na galing sa request body
        // User.FindFirstValue() reads claims from the token
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userIdClaim == null)
        {
            return Unauthorized(new { error = "User ID claim not found" });
        }

        // userID is stored as a string in the JWT token, so we need to convert it to an integer

        // Convert the userId claim to an integer
        var userId = int.Parse(userIdClaim);
        var result = await _attendanceService.TimeIn(userId);
        return Ok(result);
    }

    // POST /api/attendance/time-out
    [HttpPost("time-out")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> RequestTimeOut([FromBody] TimeOutRequest request)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userIdClaim == null)
        {
            return Unauthorized(new { error = "User ID claim not found" });
        }
        var userId = int.Parse(userIdClaim);
        var result = await _attendanceService.RequestTimeOut(userId, request.Remarks);
        return Ok(result);
    }

    // GET /api/attendance/status
    [HttpGet("status")]
    public async Task<IActionResult> GetStatus()
    {
        return Ok(new { status = "Present" });
    }

    // GET /api/attendance/history
    [HttpGet("history")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> GetHistory()
    {
        // [FromRoute] is inferred — studentId comes from the URL
        // GET /api/attendance/history/1

        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userIdClaim == null)
        {
            return Unauthorized(new { error = "User ID claim not found" });
        }

        var userId = int.Parse(userIdClaim);

        var result = await _attendanceService.GetHistory(userId);
        return Ok(result);
    }
}