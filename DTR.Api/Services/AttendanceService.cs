using DTR.Api.DTOs;
using DTR.Api.Entities;
using DTR.Api.Repositories;
using DTR.Api.Exceptions;

namespace DTR.Api.Services;

public class AttendanceService : IAttendanceService
{
    private readonly IAttendanceRepository _repository;
    private readonly IDateTimeService _dateTimeService;

    public AttendanceService(IAttendanceRepository repository, IDateTimeService dateTimeService)
    {
        _repository = repository;
        _dateTimeService = dateTimeService;
    }

    public async Task<AttendanceResponse> TimeIn(int userId)
    {
        // Business Rule #1: Check if student already timed in today
        var existingRecord = await _repository.GetActiveRecordAsync(userId, _dateTimeService.Today);


        if (existingRecord != null)
        {
            // Can't time in again if already timed in today
            // ConflictException is a custom exception(/Exceptions/ConflictException.cs) that maps to HTTP 409 Conflict
            throw new ConflictException("Student has already timed in today.");
        }

        // Business Rule #2: Create new attendance record
        var record = new AttendanceRecord
        {
            StudentId = userId,
            StudentName = $"Student {userId}",
            TimeIn = _dateTimeService.Now,
            Status = "Present"
            // TimeOut — null by default
            // TotalHours — null by default
            // CreatedAt — may default value na sa entity definition
        };

        var saved = await _repository.AddAsync(record);
        return MapToResponse(saved);
    }

    public async Task<AttendanceResponse> RequestTimeOut(int userId, string? remarks)
    {
        // Business Rule: Find the active time-in record for this student
        var record = await _repository.GetActiveRecordAsync(
            userId, 
            _dateTimeService.Today);


        if (record == null)
        {
            // Can't time out if never timed in
            // NotFoundException is a custom exception(/Exceptions/NotFoundException.cs) that maps to HTTP 404 Not Found
            throw new NotFoundException("No active time-in record found.");
        }

        // Business Rule: Compute total hours
        record.TimeOut = _dateTimeService.Now;
        record.TotalHours = (record.TimeOut.Value - record.TimeIn).TotalHours;
        record.Status = "Pending"; // Pending admin approval

        // EF Core tracks changes automatically — SaveChanges() runs UPDATE
        await _repository.UpdateAsync(record);
        return MapToResponse(record);
    }

    public async Task<IEnumerable<AttendanceResponse>> GetHistory(int studentId)
    {
        var records = await _repository.GetHistoryAsync(studentId);
        return records.Select(r => MapToResponse(r));
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