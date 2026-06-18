using DTR.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace DTR.Api.Data;

public class AppDbContext : DbContext
{
    // Constructor receives DbContextOptions — configured in Program.cs
    // This is how EF Core knows which database to connect to
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    // DbSet = represents a table in the database
    // EF Core will create an "AttendanceRecords" table based on this
    public DbSet<AttendanceRecord> AttendanceRecords { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Explicitly configure the table name
        // Convention: snake_case for PostgreSQL
        modelBuilder.Entity<AttendanceRecord>(entity =>
        {
            entity.ToTable("attendance_records");

            // Configure column constraints
            entity.Property(e => e.StudentName)
                  .IsRequired()
                  .HasMaxLength(100);

            entity.Property(e => e.Status)
                  .IsRequired()
                  .HasMaxLength(20);

            // Index for faster queries — we'll frequently query by StudentId
            entity.HasIndex(e => e.StudentId);
        });
    }
}