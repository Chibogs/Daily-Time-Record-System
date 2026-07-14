using DTR.Application.Interfaces;
using DTR.Infrastructure.Data;
using DTR.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DTR.Infrastructure.Repositories;

public class AttendanceRepository : IAttendanceRepository
{
    private readonly AppDbContext _dbcontext;

    // DbContext is injected here — NOT in the Service anymore
    public AttendanceRepository(AppDbContext context)
    {
        _dbcontext = context;
    }

    public async Task<AttendanceRecord?> GetActiveRecordAsync(int studentId, DateTime today)
    {
        // async/await — non-blocking database call
        return await _dbcontext.AttendanceRecords
            .FirstOrDefaultAsync(r =>
                r.StudentId == studentId &&
                r.TimeIn.Date == today &&
                r.TimeOut == null);
    }

    public async Task<IEnumerable<AttendanceRecord>> GetHistoryAsync(int studentId)
    {
        return await _dbcontext.AttendanceRecords
            .Where(r => r.StudentId == studentId)
            .OrderByDescending(r => r.TimeIn)
            .ToListAsync();
    }

    public async Task<AttendanceRecord?> GetByIdAsync(int recordId)
    {
        return await _dbcontext.AttendanceRecords
            .FirstOrDefaultAsync(r => r.Id == recordId);
    }

    public async Task<AttendanceRecord> AddAsync(AttendanceRecord record)
    {
        // Add to DbContext tracking
        _dbcontext.AttendanceRecords.Add(record);

        // Persist to database
        await _dbcontext.SaveChangesAsync();

        // Return record with database-generated Id
        return record;
    }

    public async Task UpdateAsync(AttendanceRecord record)
    {
        // EF Core already tracks this entity — just save changes
        await _dbcontext.SaveChangesAsync();
    }

    // Get all pending attendance timeout records for admin review
    public async Task<IEnumerable<AttendanceRecord>> GetPendingRequestsAsync()
    {
        return await _dbcontext.AttendanceRecords
            .Where(r => r.Status == "Pending")
            .OrderBy(r => r.TimeOut) // Optional: order by TimeOut for better admin review
            .ToListAsync();
    }
}