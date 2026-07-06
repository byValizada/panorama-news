using Microsoft.EntityFrameworkCore;
using Panorama.Api.Data;
using Panorama.Api.DTOs;
using Panorama.Api.Models;

namespace Panorama.Api.Services;

public class SettingsService
{
    private readonly AppDbContext _db;

    public SettingsService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<SiteSettingDto>> GetAllAsync(string? lang = null)
    {
        var query = _db.SiteSettings.AsQueryable();

        if (lang != null)
            query = query.Where(s => s.Language == null || s.Language == lang);

        return await query
            .Select(s => new SiteSettingDto(s.Key, s.Value, s.Language))
            .ToListAsync();
    }

    public async Task<string?> GetValueAsync(string key, string? lang = null)
    {
        var setting = await _db.SiteSettings
            .FirstOrDefaultAsync(s => s.Key == key && s.Language == lang);

        // Fallback to global if language-specific not found
        if (setting == null && lang != null)
            setting = await _db.SiteSettings
                .FirstOrDefaultAsync(s => s.Key == key && s.Language == null);

        return setting?.Value;
    }

    public async Task<SiteSettingDto> SetValueAsync(SiteSettingUpdateDto dto)
    {
        var setting = await _db.SiteSettings
            .FirstOrDefaultAsync(s => s.Key == dto.Key && s.Language == dto.Language);

        if (setting == null)
        {
            setting = new SiteSetting
            {
                Key = dto.Key,
                Value = dto.Value,
                Language = dto.Language
            };
            _db.SiteSettings.Add(setting);
        }
        else
        {
            setting.Value = dto.Value;
            setting.UpdatedAt = DateTime.UtcNow;
        }

        await _db.SaveChangesAsync();
        return new SiteSettingDto(setting.Key, setting.Value, setting.Language);
    }

    public async Task SetBulkAsync(List<SiteSettingUpdateDto> settings)
    {
        foreach (var dto in settings)
        {
            await SetValueAsync(dto);
        }
    }
}
