using Microsoft.EntityFrameworkCore;
using Panorama.Api.Data;
using Panorama.Api.DTOs;
using Panorama.Api.Models;

namespace Panorama.Api.Services;

public class UserService
{
    private readonly AppDbContext _db;

    public UserService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<UserDto>> GetAllAsync()
    {
        return await _db.Users
            .OrderByDescending(u => u.CreatedAt)
            .Select(u => new UserDto(
                u.Id, u.Username, u.Email, u.Role,
                u.FullName, u.AvatarUrl, u.IsActive, u.CreatedAt
            ))
            .ToListAsync();
    }

    public async Task<UserDto?> GetByIdAsync(int id)
    {
        var user = await _db.Users.FindAsync(id);
        if (user == null) return null;

        return new UserDto(user.Id, user.Username, user.Email, user.Role,
            user.FullName, user.AvatarUrl, user.IsActive, user.CreatedAt);
    }

    public async Task<UserDto?> CreateAsync(UserCreateDto dto)
    {
        if (await _db.Users.AnyAsync(u => u.Username == dto.Username))
            return null;
        if (await _db.Users.AnyAsync(u => u.Email == dto.Email))
            return null;

        var user = new User
        {
            Username = dto.Username,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = dto.Role,
            FullName = dto.FullName
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        return new UserDto(user.Id, user.Username, user.Email, user.Role,
            user.FullName, user.AvatarUrl, user.IsActive, user.CreatedAt);
    }

    public async Task<UserDto?> UpdateAsync(int id, UserUpdateDto dto)
    {
        var user = await _db.Users.FindAsync(id);
        if (user == null) return null;

        if (dto.Email != null) user.Email = dto.Email;
        if (dto.Password != null) user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
        if (dto.Role != null) user.Role = dto.Role;
        if (dto.FullName != null) user.FullName = dto.FullName;
        if (dto.AvatarUrl != null) user.AvatarUrl = dto.AvatarUrl;
        if (dto.IsActive.HasValue) user.IsActive = dto.IsActive.Value;

        await _db.SaveChangesAsync();

        return new UserDto(user.Id, user.Username, user.Email, user.Role,
            user.FullName, user.AvatarUrl, user.IsActive, user.CreatedAt);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var user = await _db.Users.FindAsync(id);
        if (user == null) return false;

        // Check if user has articles
        var hasArticles = await _db.Articles.AnyAsync(a => a.AuthorId == id);
        if (hasArticles)
        {
            // Soft delete - just deactivate
            user.IsActive = false;
            await _db.SaveChangesAsync();
            return true;
        }

        _db.Users.Remove(user);
        await _db.SaveChangesAsync();
        return true;
    }
}
