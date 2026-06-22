using DTR.Api.Entities;
namespace DTR.Api.Services
{
    public interface IJwtService
    {
        string GenerateToken(User user);
    }
}