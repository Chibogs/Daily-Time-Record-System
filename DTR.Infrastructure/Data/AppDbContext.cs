using DTR.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DTR.Infrastructure.Data;

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

    // DbSet for the User entity
    public DbSet<User> Users { get; set; }

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
            
            entity.Property(e => e.StudentRemarks)
                  .HasMaxLength(500);
            
            entity.Property(e => e.AdminRemarks)
                  .HasMaxLength(500);
              // FK — StudentId → users.Id
              // "Ang bawat attendance record ay pag-aari ng isang user"
            entity.HasOne(r => r.Student)
                  .WithMany(u => u.AttendanceRecords)
                  .HasForeignKey(e => e.StudentId)
                  .OnDelete(DeleteBehavior.Restrict);
              // Restrict = kung ma-delete ang user
              //            hindi automatic madelete ang records
              //            mag-eerror para hindi mawala ang history

              // FK — ApprovedByAdminId → users.Id
              // "Ang nag-approve ay isang user (admin)"
            entity.HasOne(r => r.ApprovedByAdmin)
                  .WithMany()
                  .HasForeignKey(e => e.ApprovedByAdminId)
                  .IsRequired(false)  // nullable — pwedeng walang approver pa
                  .OnDelete(DeleteBehavior.Restrict);


            // Index for faster queries — we'll frequently query by StudentId
            entity.HasIndex(e => e.StudentId);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("users");
            
            // Username must be unique — no two users with same username
            entity.HasIndex(e => e.Username).IsUnique();

            entity.Property(e => e.Username)
                  .IsRequired()
                  .HasMaxLength(50);
            entity.Property(e => e.PasswordHash)
                  .IsRequired();
            entity.Property(e => e.Role)
                  .IsRequired()
                  .HasMaxLength(20);
            entity.Property(e => e.FullName)
                  .IsRequired()
                  .HasMaxLength(100);
        });

    }
}