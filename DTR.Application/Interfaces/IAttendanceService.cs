using DTR.Application.DTOs;

namespace DTR.Application.Interfaces;

public interface IAttendanceService
{
    // Returns the created attendance record
    Task<AttendanceResponse> TimeIn(int userId);

    // Returns the updated attendance record
    Task<AttendanceResponse> RequestTimeOut(int userId, string? remarks);

    // Returns all attendance records for a student
    Task<IEnumerable<AttendanceResponse>> GetHistory(int studentId);
}