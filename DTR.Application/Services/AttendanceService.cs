using DTR.Application.DTOs;
using DTR.Application.Interfaces;
using DTR.Domain.Entities;
using DTR.Domain.Exceptions;

namespace DTR.Application.Services;

public class AttendanceService : IAttendanceService
{
    private readonly IAttendanceRepository _repository;
    private readonly IDateTimeService _dateTimeService;
    private readonly IUserRepository _userRepository;


    public AttendanceService(IAttendanceRepository repository, IDateTimeService dateTimeService, IUserRepository userRepository)
    {
        _repository = repository;
        _dateTimeService = dateTimeService;
        _userRepository = userRepository;
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

        var user = await _userRepository.GetUserByIdAsync(userId);

        if (user == null)
        {
            throw new NotFoundException("User not found.");
        }

        // Business Rule #2: Create new attendance record
        var record = new AttendanceRecord
        {
            StudentId = userId,
            StudentName = user.FullName,
            TimeIn = _dateTimeService.Now,
            Status = "Present"
            // TimeOut — null by default
            // TotalHours — null by default
            // CreatedAt — may default value na sa entity definition
        };

        var saved = await _repository.AddAsync(record);
        return await MapToResponse(saved);
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
        record.StudentRemarks = remarks;

        // EF Core tracks changes automatically — SaveChanges() runs UPDATE
        await _repository.UpdateAsync(record);
        return await MapToResponse(record);
    }

    public async Task<IEnumerable<AttendanceResponse>> GetHistory(int studentId)
    {
        var records = await _repository.GetHistoryAsync(studentId);

        var responses = new List<AttendanceResponse>();

        foreach (var record in records)
        {
            responses.Add(await MapToResponse(record));
        }

        return responses;
    }

    public async Task<AttendanceResponse> GetById(int recordId)
    {
        var record = await _repository.GetByIdAsync(recordId);

        if (record == null)
        {
            throw new NotFoundException("Attendance record not found.");
        }

        return await MapToResponse(record);
    }

    // Private helper — maps Entity to DTO
    // Controller never sees the raw Entity
    private async Task<AttendanceResponse> MapToResponse(AttendanceRecord record)
    {
        string? approverName = null;

        if (record.ApprovedByAdminId.HasValue)
        {
            // Fetch the admin's name from the database
            var admin = await _userRepository.GetUserByIdAsync(record.ApprovedByAdminId.Value);
            approverName = admin?.FullName;
        }
        return new AttendanceResponse
        {
            Id = record.Id,
            StudentId = record.StudentId,
            StudentName = record.StudentName,
            TimeIn = record.TimeIn,
            TimeOut = record.TimeOut,
            TotalHours = record.TotalHours,
            Status = record.Status,
            StudentRemarks = record.StudentRemarks,
            AdminRemarks = record.AdminRemarks,
            ApprovedByAdminName = approverName,
            ApprovedAt = record.ApprovedAt
        };
    }
}