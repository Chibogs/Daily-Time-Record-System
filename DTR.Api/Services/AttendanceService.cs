using DTR.Api.DTOs;
using DTR.Api.Entities;
using DTR.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace DTR.Api.Services;

public class AttendanceService : IAttendanceService
{
    private readonly AppDbContext _dbContext;
    private readonly IDateTimeService _dateTimeService;

    public AttendanceService(AppDbContext dbContext, IDateTimeService dateTimeService)
    {
        _dbContext = dbContext;
        _dateTimeService = dateTimeService;
    }

    public AttendanceResponse TimeIn(TimeInRequest request)
    {
        // Business Rule #1: Check if student already timed in today
        var existingRecord = _dbContext.AttendanceRecords.FirstOrDefault(r =>
            r.StudentId == request.StudentId &&
            r.TimeIn.Date == _dateTimeService.Today &&
            r.TimeOut == null);

        if (existingRecord != null)
        {
            // We'll handle this error properly in Phase 9 (Middleware)
            // For now, just return the existing record
            return MapToResponse(existingRecord);
        }

        // Business Rule #2: Create new attendance record
        var record = new AttendanceRecord
        {
            StudentId = request.StudentId,
            StudentName = $"Student {request.StudentId}",
            TimeIn = _dateTimeService.Now,
            Status = "Present"
            // TimeOut — null by default
            // TotalHours — null by default
            // CreatedAt — may default value na sa entity definition
        };

        _dbContext.AttendanceRecords.Add(record);
        _dbContext.SaveChanges();

        return MapToResponse(record);
    }

    public AttendanceResponse RequestTimeOut(TimeOutRequest request)
    {
        // Business Rule: Find the active time-in record for this student
        var record = _dbContext.AttendanceRecords.FirstOrDefault(r =>
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

        // EF Core tracks changes automatically — SaveChanges() runs UPDATE
        _dbContext.SaveChanges();
        return MapToResponse(record);
    }

    public IEnumerable<AttendanceResponse> GetHistory(int studentId)
    {
        // Return all records for this student, newest first
        return _dbContext.AttendanceRecords
            .Where(r => r.StudentId == studentId)
            .OrderByDescending(r => r.TimeIn)
            // Map Entity to DTO directly in the query
            .Select(r => MapToResponse(r))
            .ToList();
    }

    // Private helper — maps Entity to DTO
    // Controller never sees the raw Entity
    private static AttendanceResponse MapToResponse(AttendanceRecord record)
    {
        return new AttendanceResponse
        {
            Id = record.Id,
            StudentId = record.StudentId,
            StudentName = record.StudentName,
            TimeIn = record.TimeIn,
            TimeOut = record.TimeOut,
            TotalHours = record.TotalHours,
            Status = record.Status
        };
    }
}