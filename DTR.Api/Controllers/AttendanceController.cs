using Microsoft.AspNetCore.Mvc;
using DTR.Api.DTOs;
using DTR.Api.Services;
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

    public IActionResult TimeIn([FromBody] TimeInRequest request)
    {
        // [FromBody] tells ASP.NET Core to read the JSON request body
        // and deserialize it into a TimeInRequest object.
        // With [ApiController], [FromBody] is inferred — but being explicit
        // is cleaner and easier to read for your teammates.


        var result = _attendanceService.TimeIn(request);
        return Ok(result);
    }

    // POST /api/attendance/time-out
    [HttpPost("time-out")]
    public IActionResult RequestTimeOut([FromBody] TimeOutRequest request)
    {
        var result = _attendanceService.RequestTimeOut(request);
        return Ok(result);
    }

    // GET /api/attendance/status
    [HttpGet("status")]
    public IActionResult GetStatus()
    {
        return Ok(new { status = "Present" });
    }

    // GET /api/attendance/history
    [HttpGet("history/{studentId}")]
    public IActionResult GetHistory(int studentId)
    {
        // [FromRoute] is inferred — studentId comes from the URL
        // GET /api/attendance/history/1
        var result = _attendanceService.GetHistory(studentId);
        return Ok(result);
    }
}