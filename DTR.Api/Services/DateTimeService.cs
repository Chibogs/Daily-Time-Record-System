using DTR.Api.DTOs;

namespace DTR.Api.Services;

public class DateTimeService : IDateTimeService
{
    public DateTime Now => DateTime.Now;
    public DateTime Today => DateTime.Today;
}