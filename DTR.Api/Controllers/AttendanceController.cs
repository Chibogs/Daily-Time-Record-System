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
public class AttendanceController : ControllerBase
{
    // ControllerBase vs Controller:
    // - ControllerBase: For APIs. No View support.
    // - Controller: For MVC with Razor Views. We don't need Views in a Web API.
    // Always use ControllerBase for Web APIs.

    // [HttpPost] maps this method to: POST /api/attendance/time-in
    // The string "time-in" is appended to the base route.
    [HttpPost("time-in")]
    public IActionResult TimeIn()
    {
        // IActionResult lets you return any HTTP response:
        // Ok() = 200, Created() = 201, BadRequest() = 400, NotFound() = 404, etc.

        // Placeholder response — we'll replace this with real logic in later phases
        return Ok(new { message = "Time-in recorded successfully." });
    }

    // POST /api/attendance/time-out
    [HttpPost("time-out")]
    public IActionResult RequestTimeOut()
    {
        return Ok(new { message = "Time-out request submitted." });
    }

    // GET /api/attendance/status
    [HttpGet("status")]
    public IActionResult GetStatus()
    {
        return Ok(new { status = "Present" });
    }

    // GET /api/attendance/history
    [HttpGet("history")]
    public IActionResult GetHistory()
    {
        // Returning a 200 OK with a placeholder list
        return Ok(new { message = "Attendance history retrieved.", records = Array.Empty<object>() });
    }
}