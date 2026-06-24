namespace DTR.Api.Exceptions;

public class NotFoundException : Exception
{
    // Thrown when a requested resource doesn't exist
    // Example: student tries to time-out but no active time-in record
    public NotFoundException(string message) : base(message)
    {
    }
}