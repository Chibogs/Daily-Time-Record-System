using DTR.Api.DTOs;

namespace DTR.Api.Services;

public interface IAttendanceService
{
    // Returns the created attendance record
    AttendanceResponse TimeIn(TimeInRequest request);

    // Returns the updated attendance record
    AttendanceResponse RequestTimeOut(TimeOutRequest request);

    // Returns all attendance records for a student
    IEnumerable<AttendanceResponse> GetHistory(int studentId);
}