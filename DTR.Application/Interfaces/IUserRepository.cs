using DTR.Domain.Entities;

namespace DTR.Application.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByUsernameAsync(string username);
    Task<bool> VerifyPasswordAsync(User user, string password);

    Task<User?> GetUserByIdAsync(int userId);
}