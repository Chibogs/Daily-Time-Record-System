using DTR.Application.DTOs;
using DTR.Application.Interfaces;
using DTR.Domain.Entities;
using DTR.Domain.Exceptions;

namespace DTR.Application.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<CreateUserResponse> CreateUser(CreateUserRequest request)
    {
        // Implementation for creating a new user

        var exists = await _userRepository.UsernameExistsAsync(request.Username);

        if (exists)
        {
            throw new ConflictException($"User with username '{request.Username}' already exists.");
        }

        var user = new User
        {
            Username = request.Username,
            FullName = request.FullName,
            Role = request.Role,
            IsActive = true, // New users are active by default
            CreatedAt = DateTime.UtcNow
        };

        var created = await _userRepository.CreateUserAsync(user, request.Password);
        return MapToResponse(created);  
    }

    public async Task<CreateUserResponse> DeactivateUser(int userId)
    {
        // Implementation for deactivating a user

        var user = await _userRepository.GetUserByIdAsync(userId);

        if (user == null)
        {
            throw new NotFoundException($"User with ID '{userId}' not found.");
        }

        if (!user.IsActive)
        {
            throw new ConflictException($"User with ID '{userId}' is already inactive.");
        }

        user.IsActive = false; // Deactivate the user
        await _userRepository.UpdateUserAsync(user);

        return MapToResponse(user);
    }

    public async Task<IEnumerable<CreateUserResponse>> GetAllUsers()
    {
        // Implementation for getting all users

        var users = await _userRepository.GetAllUsers();
        return users.Select(MapToResponse);
    }

    public static CreateUserResponse MapToResponse(User user)
    {
        return new CreateUserResponse
        {
            Id = user.Id,
            Username = user.Username,
            FullName = user.FullName,
            Role = user.Role,
            IsActive = user.IsActive,
            CreatedAt = user.CreatedAt,
        };
    }
}