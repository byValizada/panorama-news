using Microsoft.EntityFrameworkCore;
using Panorama.Api.Data;
using Panorama.Api.DTOs;
using Panorama.Api.Models;

namespace Panorama.Api.Services;

public class CategoryService
{
    private readonly AppDbContext _db;

    public CategoryService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<CategoryDto>> GetAllAsync(string lang = "az")
    {
        return await _db.Categories
            .Include(c => c.Translations)
            .Include(c => c.Articles)
            .Where(c => c.IsActive)
            .OrderBy(c => c.SortOrder)
            .Select(c => new CategoryDto(
                c.Id,
                c.Slug,
                c.Color,
                c.Icon,
                c.SortOrder,
                c.IsActive,
                c.Translations.FirstOrDefault(t => t.Language == lang)!.Name
                    ?? c.Translations.FirstOrDefault(t => t.Language == "az")!.Name,
                c.Translations.FirstOrDefault(t => t.Language == lang)!.Description
                    ?? c.Translations.FirstOrDefault(t => t.Language == "az")!.Description,
                c.Articles.Count(a => a.IsPublished)
            ))
            .ToListAsync();
    }

    public async Task<List<CategoryDto>> GetAllAdminAsync(string lang = "az")
    {
        return await _db.Categories
            .Include(c => c.Translations)
            .Include(c => c.Articles)
            .OrderBy(c => c.SortOrder)
            .Select(c => new CategoryDto(
                c.Id,
                c.Slug,
                c.Color,
                c.Icon,
                c.SortOrder,
                c.IsActive,
                c.Translations.FirstOrDefault(t => t.Language == lang)!.Name
                    ?? c.Translations.FirstOrDefault(t => t.Language == "az")!.Name,
                c.Translations.FirstOrDefault(t => t.Language == lang)!.Description,
                c.Articles.Count
            ))
            .ToListAsync();
    }

    public async Task<CategoryDto?> GetBySlugAsync(string slug, string lang = "az")
    {
        return await _db.Categories
            .Include(c => c.Translations)
            .Include(c => c.Articles)
            .Where(c => c.Slug == slug && c.IsActive)
            .Select(c => new CategoryDto(
                c.Id,
                c.Slug,
                c.Color,
                c.Icon,
                c.SortOrder,
                c.IsActive,
                c.Translations.FirstOrDefault(t => t.Language == lang)!.Name
                    ?? c.Translations.FirstOrDefault(t => t.Language == "az")!.Name,
                c.Translations.FirstOrDefault(t => t.Language == lang)!.Description,
                c.Articles.Count(a => a.IsPublished)
            ))
            .FirstOrDefaultAsync();
    }

    public async Task<CategoryDto> CreateAsync(CategoryCreateDto dto)
    {
        var category = new Category
        {
            Slug = dto.Slug,
            Color = dto.Color,
            Icon = dto.Icon,
            SortOrder = dto.SortOrder,
            Translations = dto.Translations.Select(t => new CategoryTranslation
            {
                Language = t.Language,
                Name = t.Name,
                Description = t.Description
            }).ToList()
        };

        _db.Categories.Add(category);
        await _db.SaveChangesAsync();

        var name = category.Translations.FirstOrDefault(t => t.Language == "az")?.Name
                   ?? category.Translations.First().Name;

        return new CategoryDto(category.Id, category.Slug, category.Color,
            category.Icon, category.SortOrder, category.IsActive, name, null, 0);
    }

    public async Task<CategoryDto?> UpdateAsync(int id, CategoryUpdateDto dto)
    {
        var category = await _db.Categories
            .Include(c => c.Translations)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (category == null) return null;

        if (dto.Slug != null) category.Slug = dto.Slug;
        if (dto.Color != null) category.Color = dto.Color;
        if (dto.Icon != null) category.Icon = dto.Icon;
        if (dto.SortOrder.HasValue) category.SortOrder = dto.SortOrder.Value;
        if (dto.IsActive.HasValue) category.IsActive = dto.IsActive.Value;

        if (dto.Translations != null)
        {
            // Remove existing and replace
            _db.CategoryTranslations.RemoveRange(category.Translations);
            category.Translations = dto.Translations.Select(t => new CategoryTranslation
            {
                CategoryId = category.Id,
                Language = t.Language,
                Name = t.Name,
                Description = t.Description
            }).ToList();
        }

        await _db.SaveChangesAsync();

        var name = category.Translations.FirstOrDefault(t => t.Language == "az")?.Name
                   ?? category.Translations.First().Name;

        return new CategoryDto(category.Id, category.Slug, category.Color,
            category.Icon, category.SortOrder, category.IsActive, name, null,
            await _db.Articles.CountAsync(a => a.CategoryId == id));
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var category = await _db.Categories.FindAsync(id);
        if (category == null) return false;

        var hasArticles = await _db.Articles.AnyAsync(a => a.CategoryId == id);
        if (hasArticles) return false; // Cannot delete category with articles

        _db.Categories.Remove(category);
        await _db.SaveChangesAsync();
        return true;
    }
}
