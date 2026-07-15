using DTR.Domain.Entities;

namespace DTR.Application.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByUsernameAsync(string username);
    Task<bool> VerifyPasswordAsync(User user, string password);

    Task<User?> GetUserByIdAsync(int userId);

    Task<bool> UsernameExistsAsync(string username);
    Task<User> CreateUserAsync(User user, string plainPassword);
    Task UpdateUserAsync(User user);

    Task<IEnumerable<User>> GetAllUsers();
}