using DTR.Application.Interfaces;

namespace DTR.Infrastructure.Services;

public class DateTimeService : IDateTimeService
{
    public DateTime Now => DateTime.UtcNow;
    public DateTime Today => DateTime.UtcNow.Date;
}