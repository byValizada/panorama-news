using Microsoft.EntityFrameworkCore;
using Panorama.Api.Data;
using Panorama.Api.DTOs;
using Panorama.Api.Models;

namespace Panorama.Api.Services;

public class MediaService
{
    private readonly AppDbContext _db;
    private readonly IWebHostEnvironment _env;

    public MediaService(AppDbContext db, IWebHostEnvironment env)
    {
        _db = db;
        _env = env;
    }

    public async Task<List<MediaFileDto>> GetAllAsync()
    {
        return await _db.MediaFiles
            .Include(m => m.UploadedBy)
            .OrderByDescending(m => m.UploadedAt)
            .Select(m => new MediaFileDto(
                m.Id, m.FileName, m.FilePath, m.FileType, m.FileSize,
                m.AltText, m.UploadedAt,
                m.UploadedBy.FullName ?? m.UploadedBy.Username
            ))
            .ToListAsync();
    }

    public async Task<MediaFileDto?> UploadAsync(IFormFile file, int uploadedById, string? altText)
    {
        if (file.Length == 0) return null;

        // Validate file type
        var allowedTypes = new[] { "image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml" };
        var contentType = file.ContentType.ToLower();
        if (!allowedTypes.Contains(contentType))
            return null;

        // Create uploads directory
        var uploadsDir = Path.Combine(_env.ContentRootPath, "uploads", "media");
        Directory.CreateDirectory(uploadsDir);

        // Generate unique filename
        var extension = Path.GetExtension(file.FileName).ToLower();
        var uniqueName = $"{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(uploadsDir, uniqueName);

        // SVG Security Sanitization (XSS Mitigation)
        if (contentType == "image/svg+xml" || extension == ".svg")
        {
            using (var reader = new StreamReader(file.OpenReadStream()))
            {
                var content = await reader.ReadToEndAsync();
                var lowerContent = content.ToLowerInvariant();
                
                // Block script tags and javascript/onload event attributes in XML
                if (lowerContent.Contains("<script") || 
                    lowerContent.Contains("javascript:") || 
                    System.Text.RegularExpressions.Regex.IsMatch(lowerContent, @"\bon\w+\s*="))
                {
                    return null; // Unsafe file rejected
                }
            }
        }

        // Save file
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // Save to database
        var mediaFile = new MediaFile
        {
            UploadedById = uploadedById,
            FileName = file.FileName,
            FilePath = $"/uploads/media/{uniqueName}",
            FileType = file.ContentType,
            FileSize = file.Length,
            AltText = altText
        };

        _db.MediaFiles.Add(mediaFile);
        await _db.SaveChangesAsync();

        var user = await _db.Users.FindAsync(uploadedById);

        return new MediaFileDto(
            mediaFile.Id, mediaFile.FileName, mediaFile.FilePath,
            mediaFile.FileType, mediaFile.FileSize, mediaFile.AltText,
            mediaFile.UploadedAt, user?.FullName ?? user?.Username ?? "Unknown"
        );
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var mediaFile = await _db.MediaFiles.FindAsync(id);
        if (mediaFile == null) return false;

        // Delete physical file
        var fullPath = Path.Combine(_env.ContentRootPath, mediaFile.FilePath.TrimStart('/'));
        if (File.Exists(fullPath))
            File.Delete(fullPath);

        _db.MediaFiles.Remove(mediaFile);
        await _db.SaveChangesAsync();
        return true;
    }
}
