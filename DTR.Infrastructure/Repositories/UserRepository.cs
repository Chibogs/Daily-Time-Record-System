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

    public async Task<bool> UsernameExistsAsync(string username)
    {
        // Check if a user with the given username already exists
        return await _context.Users.AnyAsync(u => u.Username == username);
    }

    public async Task<User> CreateUserAsync(User user, string plainPassword)
    {
        // Add the new user to the context and save changes

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(plainPassword); // Hash the password before saving
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task UpdateUserAsync(User user)
    {
        // Update the user in the context and save changes
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<User>> GetAllUsers()
    {
        // Retrieve all users from the database
        return await _context.Users.ToListAsync();
    }
}
