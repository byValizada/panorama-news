using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Panorama.Api.Data;
using Panorama.Api.DTOs;

namespace Panorama.Api.Controllers.Admin;

[ApiController]
[Route("api/admin/dashboard")]
[Authorize(Roles = "Admin,Editor")]
public class AdminDashboardController : ControllerBase
{
    private readonly AppDbContext _db;

    public AdminDashboardController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetDashboard()
    {
        var totalArticles = await _db.Articles.CountAsync();
        var publishedArticles = await _db.Articles.CountAsync(a => a.IsPublished);
        var draftArticles = totalArticles - publishedArticles;
        var totalCategories = await _db.Categories.CountAsync(c => c.IsActive);
        var totalUsers = await _db.Users.CountAsync(u => u.IsActive);
        var totalMediaFiles = await _db.MediaFiles.CountAsync();
        var totalViews = await _db.Articles.SumAsync(a => a.ViewCount);

        var recentArticles = await _db.Articles
            .Include(a => a.Translations)
            .Include(a => a.Category).ThenInclude(c => c.Translations)
            .Include(a => a.Author)
            .OrderByDescending(a => a.CreatedAt)
            .Take(5)
            .Select(a => new ArticleListDto(
                a.Id, a.Slug, a.FeaturedImage, a.IsBreaking, a.IsFeatured,
                a.ViewCount, a.PublishedAt,
                a.Translations.FirstOrDefault(t => t.Language == "az")!.Title,
                a.Translations.FirstOrDefault(t => t.Language == "az")!.Summary,
                a.Category.Translations.FirstOrDefault(t => t.Language == "az")!.Name,
                a.Category.Slug, a.Category.Color,
                a.Author.FullName ?? a.Author.Username
            ))
            .ToListAsync();

        var topCategories = await _db.Categories
            .Include(c => c.Translations)
            .Include(c => c.Articles)
            .Where(c => c.IsActive)
            .OrderByDescending(c => c.Articles.Count)
            .Take(5)
            .Select(c => new CategoryDto(
                c.Id, c.Slug, c.Color, c.Icon, c.SortOrder, c.IsActive,
                c.Translations.FirstOrDefault(t => t.Language == "az")!.Name,
                null, c.Articles.Count
            ))
            .ToListAsync();

        var dashboard = new DashboardDto(
            totalArticles, publishedArticles, draftArticles,
            totalCategories, totalUsers, totalMediaFiles, totalViews,
            recentArticles, topCategories
        );

        return Ok(dashboard);
    }
}
