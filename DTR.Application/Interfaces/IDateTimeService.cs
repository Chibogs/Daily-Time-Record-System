namespace DTR.Application.Interfaces;
public interface IDateTimeService
{
    DateTime Now { get; }
    DateTime Today { get; }
}