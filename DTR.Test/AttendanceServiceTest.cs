using DTR.Application.DTOs;
using DTR.Application.Interfaces;
using DTR.Application.Services;
using DTR.Domain.Entities;
using DTR.Domain.Exceptions;
using Moq;
using Xunit;

namespace DTR.Test;

public class AttendanceServiceTest
{
    [Fact]
    public async Task Test_AttendanceService_GenerateReport()
    {
        // Arrange

        // Mock 1 - IAttendanceRepository
        var mockAttendanceRepository = new Mock<IAttendanceRepository>();
        mockAttendanceRepository
        .Setup(repo => repo.GetActiveRecordAsync(It.IsAny<int>(), It.IsAny<DateTime>()))
        .ReturnsAsync((AttendanceRecord?)null); // Simulate no existing record

        // Mock 2 - IUserRepository
        var mockUserRepository = new Mock<IUserRepository>();
        var testUser = new User
        {
            Id = 2,
            Username = "student1",
            FullName = "Juan dela Cruz",
            Role = "Student"  
        };
        mockUserRepository.Setup(repo => repo.GetUserByIdAsync(2)).ReturnsAsync(testUser);

        // Mock 3 - IDateTimeService

        var mockDateTimeService = new Mock<IDateTimeService>();
        var testDateTime = new DateTime(2026, 7, 21, 8, 0, 0, DateTimeKind.Utc); // July 21, 2026, 08:00 AM
        mockDateTimeService.Setup(d => d.Today).Returns(testDateTime);
        mockDateTimeService.Setup(d => d.Now).Returns(testDateTime);

        // Kailangan din i-mock ang AddAsync — para "i-simulate"
        // na successfully na-save ang record

        mockAttendanceRepository
            .Setup(repo => repo.AddAsync(It.IsAny<AttendanceRecord>()))
            .ReturnsAsync((AttendanceRecord record) => record); // Return the same record
                                                                //   ibabalik lang natin ang parehong record na ipinasa — parang sinabi nating "successfully na-save ito"

        // Create ang AttendanceService gamit ang MOCK objects
        // (Instead na totoong AttendanceRepository, UserRepository)
        var service = new AttendanceService(
            mockAttendanceRepository.Object,
            mockDateTimeService.Object,
            mockUserRepository.Object);


        // Act
        var result = await service.TimeIn(2);

        // Assert

        Assert.NotNull(result);
        Assert.Equal("Present", result.Status);
        Assert.Equal(2, result.StudentId);
        Assert.Equal("Juan dela Cruz", result.StudentName);
        Assert.Null(result.TimeOut);
    }
}