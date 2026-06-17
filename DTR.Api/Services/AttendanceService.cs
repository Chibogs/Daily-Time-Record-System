using DTR.Api.DTOs;

namespace DTR.Api.Services;

public class AttendanceService : IAttendanceService
{
    // Temporary in-memory list — aalisin natin to pag may database na (Phase 5)
    // Think of this as a fake database for now
    private static readonly List<AttendanceResponse> _records = new();
    private static int _nextId = 1;
    private readonly IDateTimeService _dateTimeService;

    public AttendanceService(IDateTimeService dateTimeService)
    {
        _dateTimeService = dateTimeService;
    }

    public AttendanceResponse TimeIn(TimeInRequest request)
    {
        // Business Rule #1: Check if student already timed in today
        var existingRecord = _records.FirstOrDefault(r =>
            r.StudentId == request.StudentId &&
            r.TimeIn.Date == _dateTimeService.Today &&
            r.TimeOut == null);

        if (existingRecord != null)
        {
            // We'll handle this error properly in Phase 9 (Middleware)
            // For now, just return the existing record
            return existingRecord;
        }

        // Business Rule #2: Create new attendance record
        var record = new AttendanceResponse
        {
            Id = _nextId++,
            StudentId = request.StudentId,
            StudentName = $"Student {request.StudentId}", // placeholder until we have DB
            TimeIn = _dateTimeService.Now,
            TimeOut = null,
            TotalHours = null,
            Status = "Present"
        };

        _records.Add(record);
        return record;
    }

    public AttendanceResponse RequestTimeOut(TimeOutRequest request)
    {
        // Business Rule: Find the active time-in record for this student
        var record = _records.FirstOrDefault(r =>
            r.StudentId == request.StudentId &&
            r.TimeIn.Date == _dateTimeService.Today &&
            r.TimeOut == null);

        if (record == null)
        {
            // Can't time out if never timed in
            // Proper error handling in Phase 9
            throw new InvalidOperationException("No active time-in record found.");
        }

        // Business Rule: Compute total hours
        record.TimeOut = _dateTimeService.Now;
        record.TotalHours = (record.TimeOut.Value - record.TimeIn).TotalHours;
        record.Status = "Pending"; // Pending admin approval

        return record;
    }

    public IEnumerable<AttendanceResponse> GetHistory(int studentId)
    {
        // Return all records for this student, newest first
        return _records
            .Where(r => r.StudentId == studentId)
            .OrderByDescending(r => r.TimeIn);
    }
}