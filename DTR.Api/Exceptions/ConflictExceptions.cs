namespace DTR.Api.Exceptions;

public class ConflictException : Exception
{
    // Thrown when a business rule conflict occurs
    // Example: student tries to time-in but already timed in today
    public ConflictException(string message) : base(message)
    {
    }
}