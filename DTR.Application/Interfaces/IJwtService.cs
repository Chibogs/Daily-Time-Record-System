using DTR.Domain.Entities;

namespace DTR.Application.Interfaces;

public interface IJwtService
{
    string GenerateToken(User user);
}