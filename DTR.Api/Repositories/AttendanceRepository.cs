using DTR.Api.Data;
using DTR.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace DTR.Api.Repositories;

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
        // We'll explain async properly in a moment
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
}