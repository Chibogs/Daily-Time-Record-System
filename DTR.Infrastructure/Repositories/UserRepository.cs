using DTR.Application.Interfaces;
using DTR.Domain.Entities;
using DTR.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DTR.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    // Implement the methods defined in IUserRepository
    public async Task<User?> GetByUsernameAsync(string username)
    {
        // Use FirstOrDefaultAsync to find the user by username
        return await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
    }

    public async Task<bool> VerifyPasswordAsync(User user, string password)
    {
        // Use BCrypt to verify the password against the stored hash
        return BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
    }

    public async Task<User?> GetUserByIdAsync(int userId)
    {
        // Use FirstOrDefaultAsync to find the user by ID
        return await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
    }
}
