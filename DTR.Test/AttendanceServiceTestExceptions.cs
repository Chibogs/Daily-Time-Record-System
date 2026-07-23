using DTR.Application.DTOs;
using DTR.Application.Interfaces;
using DTR.Application.Services;
using DTR.Domain.Entities;
using DTR.Domain.Exceptions;
using Moq;
using Xunit;

namespace DTR.Test;

public class AttendanceServiceTestExceptions
{
    [Fact]
    public async Task TimeIn_WhenActiveRecordExists_ThrowsConflictException()
    {
        // Arrange
        // Mock 1 - IAttendanceRepository

        var mockAttendanceRepository = new Mock<IAttendanceRepository>();
        var existingRecord = new AttendanceRecord
        {
            Id = 1,
            StudentId = 2,
            StudentName = "Juan dela Cruz",
            TimeIn = new DateTime(2026, 7, 21, 8, 0, 0, DateTimeKind.Utc),
            Status = "Present",
            TimeOut = null,
        };

        mockAttendanceRepository
            .Setup(repo => repo.GetActiveRecordAsync(It.IsAny<int>(), It.IsAny<DateTime>()))
            .ReturnsAsync(existingRecord);

        // Act and Assert
        var service = new AttendanceService(
            mockAttendanceRepository.Object,
            Mock.Of<IDateTimeService>(),
            Mock.Of<IUserRepository>());
        
        await Assert.ThrowsAsync<ConflictException>(() => service.TimeIn(2));
    }
}
// Simulate user not found