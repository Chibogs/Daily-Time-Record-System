using DTR.Domain.Entities;

namespace DTR.Application.Interfaces;

public interface IAttendanceRepository
{
    // Find an active time-in record for a student today
    // Returns null if none found
    Task<AttendanceRecord?> GetActiveRecordAsync(int studentId, DateTime today);

    // Get all records for a student, ordered by TimeIn descending
    Task<IEnumerable<AttendanceRecord>> GetHistoryAsync(int studentId);

    // Get a record by its ID
    Task<AttendanceRecord?> GetByIdAsync(int recordId);

    // Insert a new record into the database
    Task<AttendanceRecord> AddAsync(AttendanceRecord record);

    // Save changes to an existing tracked record
    Task UpdateAsync(AttendanceRecord record);
}