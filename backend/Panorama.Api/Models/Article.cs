using System.ComponentModel.DataAnnotations;

namespace Panorama.Api.Models;

public class Article
{
    public int Id { get; set; }

    public int CategoryId { get; set; }

    public int AuthorId { get; set; }

    [Required, MaxLength(200)]
    public string Slug { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? FeaturedImage { get; set; }

    public bool IsBreaking { get; set; } = false;

    public bool IsFeatured { get; set; } = false;

    public bool IsPublished { get; set; } = false;

    public int ViewCount { get; set; } = 0;

    public DateTime? PublishedAt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public Category Category { get; set; } = null!;
    public User Author { get; set; } = null!;
    public ICollection<ArticleTranslation> Translations { get; set; } = new List<ArticleTranslation>();
}

public class ArticleTranslation
{
    public int Id { get; set; }

    public int ArticleId { get; set; }

    [Required, MaxLength(5)]
    public string Language { get; set; } = "az"; // az, en, ru

    [Required, MaxLength(300)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Summary { get; set; }

    public string? Content { get; set; } // HTML content

    [MaxLength(200)]
    public string? MetaTitle { get; set; }

    [MaxLength(500)]
    public string? MetaDescription { get; set; }

    // Navigation
    public Article Article { get; set; } = null!;
}
