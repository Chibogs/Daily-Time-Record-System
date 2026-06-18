using DTR.Api.DTOs;

namespace DTR.Api.Services;

public class DateTimeService : IDateTimeService
{
    public DateTime Now => DateTime.UtcNow;
    public DateTime Today => DateTime.UtcNow.Date;
}