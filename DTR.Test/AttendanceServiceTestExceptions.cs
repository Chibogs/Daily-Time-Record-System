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

        // Create a mock of IAttendanceRepository
        var mockAttendanceRepository = new Mock<IAttendanceRepository>();

        // Create a sample existing attendance record to simulate an active record
        var existingRecord = new AttendanceRecord
        {
            Id = 1,
            StudentId = 2,
            StudentName = "Juan dela Cruz",
            TimeIn = new DateTime(2026, 7, 21, 8, 0, 0, DateTimeKind.Utc),
            Status = "Present",
            TimeOut = null,
        };

        // Simulate that an active record already exists for the student
        mockAttendanceRepository
            .Setup(repo => repo.GetActiveRecordAsync(It.IsAny<int>(), It.IsAny<DateTime>()))
            .ReturnsAsync(existingRecord);

        // Act and Assert

        // Create the AttendanceService with the mocked repository
        var service = new AttendanceService(
            mockAttendanceRepository.Object, // Use the mocked IAttendanceRepository 
            Mock.Of<IDateTimeService>(), // Use a mock of IDateTimeService
            Mock.Of<IUserRepository>()); // Use a mock of IUserRepository
        
        await Assert.ThrowsAsync<ConflictException>(() => service.TimeIn(2));
    }
}