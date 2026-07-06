using Microsoft.EntityFrameworkCore;
using Panorama.Api.Data;
using Panorama.Api.DTOs;
using Panorama.Api.Models;

namespace Panorama.Api.Services;

public class ArticleService
{
    private readonly AppDbContext _db;

    public ArticleService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<PagedResult<ArticleListDto>> GetPublishedAsync(string lang = "az", int page = 1, int pageSize = 20)
    {
        var query = _db.Articles
            .Include(a => a.Translations)
            .Include(a => a.Category).ThenInclude(c => c.Translations)
            .Include(a => a.Author)
            .Where(a => a.IsPublished)
            .OrderByDescending(a => a.PublishedAt);

        return await PaginateAsync(query, lang, page, pageSize);
    }

    public async Task<PagedResult<ArticleListDto>> GetByCategoryAsync(string categorySlug, string lang = "az", int page = 1, int pageSize = 20)
    {
        var query = _db.Articles
            .Include(a => a.Translations)
            .Include(a => a.Category).ThenInclude(c => c.Translations)
            .Include(a => a.Author)
            .Where(a => a.IsPublished && a.Category.Slug == categorySlug)
            .OrderByDescending(a => a.PublishedAt);

        return await PaginateAsync(query, lang, page, pageSize);
    }

    public async Task<List<ArticleListDto>> GetFeaturedAsync(string lang = "az", int count = 5)
    {
        return await _db.Articles
            .Include(a => a.Translations)
            .Include(a => a.Category).ThenInclude(c => c.Translations)
            .Include(a => a.Author)
            .Where(a => a.IsPublished && a.IsFeatured)
            .OrderByDescending(a => a.PublishedAt)
            .Take(count)
            .Select(a => MapToListDto(a, lang))
            .ToListAsync();
    }

    public async Task<List<ArticleListDto>> GetBreakingAsync(string lang = "az", int count = 10)
    {
        return await _db.Articles
            .Include(a => a.Translations)
            .Include(a => a.Category).ThenInclude(c => c.Translations)
            .Include(a => a.Author)
            .Where(a => a.IsPublished && a.IsBreaking)
            .OrderByDescending(a => a.PublishedAt)
            .Take(count)
            .Select(a => MapToListDto(a, lang))
            .ToListAsync();
    }

    public async Task<List<ArticleListDto>> GetTrendingAsync(string lang = "az", int count = 10)
    {
        return await _db.Articles
            .Include(a => a.Translations)
            .Include(a => a.Category).ThenInclude(c => c.Translations)
            .Include(a => a.Author)
            .Where(a => a.IsPublished)
            .OrderByDescending(a => a.ViewCount)
            .Take(count)
            .Select(a => MapToListDto(a, lang))
            .ToListAsync();
    }

    public async Task<List<ArticleListDto>> GetLatestAsync(string lang = "az", int count = 10)
    {
        return await _db.Articles
            .Include(a => a.Translations)
            .Include(a => a.Category).ThenInclude(c => c.Translations)
            .Include(a => a.Author)
            .Where(a => a.IsPublished)
            .OrderByDescending(a => a.PublishedAt)
            .Take(count)
            .Select(a => MapToListDto(a, lang))
            .ToListAsync();
    }

    public async Task<ArticleDto?> GetBySlugAsync(string slug, string lang = "az")
    {
        var article = await _db.Articles
            .Include(a => a.Translations)
            .Include(a => a.Category).ThenInclude(c => c.Translations)
            .Include(a => a.Author)
            .FirstOrDefaultAsync(a => a.Slug == slug && a.IsPublished);

        if (article == null) return null;

        // Increment view count
        article.ViewCount++;
        await _db.SaveChangesAsync();

        return MapToDto(article, lang);
    }

    public async Task<PagedResult<ArticleListDto>> SearchAsync(string query, string lang = "az", int page = 1, int pageSize = 20)
    {
        var q = _db.Articles
            .Include(a => a.Translations)
            .Include(a => a.Category).ThenInclude(c => c.Translations)
            .Include(a => a.Author)
            .Where(a => a.IsPublished && a.Translations.Any(t =>
                t.Title.Contains(query) ||
                (t.Summary != null && t.Summary.Contains(query)) ||
                (t.Content != null && t.Content.Contains(query))))
            .OrderByDescending(a => a.PublishedAt);

        return await PaginateAsync(q, lang, page, pageSize);
    }

    // ===== Admin Methods =====

    public async Task<PagedResult<ArticleListDto>> GetAllAdminAsync(string lang = "az", int page = 1, int pageSize = 20)
    {
        var query = _db.Articles
            .Include(a => a.Translations)
            .Include(a => a.Category).ThenInclude(c => c.Translations)
            .Include(a => a.Author)
            .OrderByDescending(a => a.CreatedAt);

        return await PaginateAsync(query, lang, page, pageSize);
    }

    public async Task<ArticleDto?> GetByIdAdminAsync(int id, string lang = "az")
    {
        var article = await _db.Articles
            .Include(a => a.Translations)
            .Include(a => a.Category).ThenInclude(c => c.Translations)
            .Include(a => a.Author)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (article == null) return null;
        return MapToDto(article, lang);
    }

    public async Task<ArticleDto> CreateAsync(ArticleCreateDto dto, int authorId)
    {
        var article = new Article
        {
            CategoryId = dto.CategoryId,
            AuthorId = authorId,
            Slug = dto.Slug,
            FeaturedImage = dto.FeaturedImage,
            IsBreaking = dto.IsBreaking,
            IsFeatured = dto.IsFeatured,
            IsPublished = dto.IsPublished,
            PublishedAt = dto.IsPublished ? DateTime.UtcNow : null,
            Translations = dto.Translations.Select(t => new ArticleTranslation
            {
                Language = t.Language,
                Title = t.Title,
                Summary = t.Summary,
                Content = t.Content,
                MetaTitle = t.MetaTitle,
                MetaDescription = t.MetaDescription
            }).ToList()
        };

        _db.Articles.Add(article);
        await _db.SaveChangesAsync();

        // Reload with relations
        await _db.Entry(article).Reference(a => a.Category).LoadAsync();
        await _db.Entry(article.Category).Collection(c => c.Translations).LoadAsync();
        await _db.Entry(article).Reference(a => a.Author).LoadAsync();

        return MapToDto(article, "az");
    }

    public async Task<ArticleDto?> UpdateAsync(int id, ArticleUpdateDto dto)
    {
        var article = await _db.Articles
            .Include(a => a.Translations)
            .Include(a => a.Category).ThenInclude(c => c.Translations)
            .Include(a => a.Author)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (article == null) return null;

        if (dto.CategoryId.HasValue) article.CategoryId = dto.CategoryId.Value;
        if (dto.Slug != null) article.Slug = dto.Slug;
        if (dto.FeaturedImage != null) article.FeaturedImage = dto.FeaturedImage;
        if (dto.IsBreaking.HasValue) article.IsBreaking = dto.IsBreaking.Value;
        if (dto.IsFeatured.HasValue) article.IsFeatured = dto.IsFeatured.Value;
        if (dto.IsPublished.HasValue)
        {
            article.IsPublished = dto.IsPublished.Value;
            if (dto.IsPublished.Value && article.PublishedAt == null)
                article.PublishedAt = DateTime.UtcNow;
        }

        article.UpdatedAt = DateTime.UtcNow;

        if (dto.Translations != null)
        {
            _db.ArticleTranslations.RemoveRange(article.Translations);
            article.Translations = dto.Translations.Select(t => new ArticleTranslation
            {
                ArticleId = article.Id,
                Language = t.Language,
                Title = t.Title,
                Summary = t.Summary,
                Content = t.Content,
                MetaTitle = t.MetaTitle,
                MetaDescription = t.MetaDescription
            }).ToList();
        }

        await _db.SaveChangesAsync();

        // Reload category if changed
        if (dto.CategoryId.HasValue)
        {
            await _db.Entry(article).Reference(a => a.Category).LoadAsync();
            await _db.Entry(article.Category).Collection(c => c.Translations).LoadAsync();
        }

        return MapToDto(article, "az");
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var article = await _db.Articles.FindAsync(id);
        if (article == null) return false;

        _db.Articles.Remove(article);
        await _db.SaveChangesAsync();
        return true;
    }

    // ===== Private Helpers =====

    private static ArticleListDto MapToListDto(Article a, string lang)
    {
        var trans = a.Translations.FirstOrDefault(t => t.Language == lang)
                    ?? a.Translations.FirstOrDefault(t => t.Language == "az")
                    ?? a.Translations.First();

        var catTrans = a.Category.Translations.FirstOrDefault(t => t.Language == lang)
                       ?? a.Category.Translations.FirstOrDefault(t => t.Language == "az")
                       ?? a.Category.Translations.First();

        return new ArticleListDto(
            a.Id, a.Slug, a.FeaturedImage, a.IsBreaking, a.IsFeatured,
            a.ViewCount, a.PublishedAt,
            trans.Title, trans.Summary,
            catTrans.Name, a.Category.Slug, a.Category.Color,
            a.Author.FullName ?? a.Author.Username
        );
    }

    private static ArticleDto MapToDto(Article a, string lang)
    {
        var trans = a.Translations.FirstOrDefault(t => t.Language == lang)
                    ?? a.Translations.FirstOrDefault(t => t.Language == "az")
                    ?? a.Translations.First();

        var catTrans = a.Category.Translations.FirstOrDefault(t => t.Language == lang)
                       ?? a.Category.Translations.FirstOrDefault(t => t.Language == "az")
                       ?? a.Category.Translations.First();

        return new ArticleDto(
            a.Id, a.Slug, a.FeaturedImage, a.IsBreaking, a.IsFeatured,
            a.IsPublished, a.ViewCount, a.PublishedAt, a.CreatedAt, a.UpdatedAt,
            trans.Title, trans.Summary, trans.Content,
            new CategoryDto(a.Category.Id, a.Category.Slug, a.Category.Color,
                a.Category.Icon, a.Category.SortOrder, a.Category.IsActive,
                catTrans.Name, catTrans.Description,
                0), // article count not needed here
            new AuthorDto(a.Author.Id, a.Author.Username,
                a.Author.FullName, a.Author.AvatarUrl)
        );
    }

    private async Task<PagedResult<ArticleListDto>> PaginateAsync(
        IOrderedQueryable<Article> query, string lang, int page, int pageSize)
    {
        var total = await query.CountAsync();
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(a => MapToListDto(a, lang))
            .ToListAsync();

        return new PagedResult<ArticleListDto>(
            items, total, page, pageSize, (int)Math.Ceiling(total / (double)pageSize));
    }
}
