using DTR.Application.DTOs;

namespace DTR.Application.Interfaces;

public interface IUserService
{
    Task<CreateUserResponse> CreateUser(CreateUserRequest request);
    Task<CreateUserResponse> DeactivateUser(int userId);
    Task<IEnumerable<CreateUserResponse>> GetAllUsers();
}