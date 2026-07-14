using System.Security.Claims;
using DTR.Application.Interfaces;
using DTR.Application.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DTR.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly IAttendanceService _attendanceService;

    public AdminController(IAttendanceService attendanceService)
    {
        _attendanceService = attendanceService;
    }

    [HttpGet("pending-timeout-requests")]
    public async Task<IActionResult> GetPendingTimeoutRequests()
    {
        var requests = await _attendanceService.GetPendingTimeOutRequests();
        return Ok(requests);
    }

    [HttpPost("approve/{id}")]
    public async Task<IActionResult> Approve(int id, [FromBody] ApprovalActionsRequest request)
    {
        var adminIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (adminIdClaim == null) return Unauthorized();

        var adminId = int.Parse(adminIdClaim);
        var result = await _attendanceService.ApproveTimeOutRequest(id, adminId, request.AdminRemarks);
        return Ok(result);
    }

    [HttpPost("reject/{id}")]
    public async Task<IActionResult> Reject(int id, [FromBody] ApprovalActionsRequest request)
    {
        var adminIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (adminIdClaim == null) return Unauthorized();

        var adminId = int.Parse(adminIdClaim);
        var result = await _attendanceService.RejectTimeOutRequest(id, adminId, request.AdminRemarks);
        return Ok(result);
    }
}