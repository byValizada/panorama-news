using System.ComponentModel.DataAnnotations;

namespace Panorama.Api.Models;

public class Category
{
    public int Id { get; set; }

    [Required, MaxLength(100)]
    public string Slug { get; set; } = string.Empty;

    [MaxLength(7)]
    public string Color { get; set; } = "#E63946"; // Hex color

    [MaxLength(50)]
    public string? Icon { get; set; }

    public int SortOrder { get; set; } = 0;

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<CategoryTranslation> Translations { get; set; } = new List<CategoryTranslation>();
    public ICollection<Article> Articles { get; set; } = new List<Article>();
}

public class CategoryTranslation
{
    public int Id { get; set; }

    public int CategoryId { get; set; }

    [Required, MaxLength(5)]
    public string Language { get; set; } = "az"; // az, en, ru

    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    // Navigation
    public Category Category { get; set; } = null!;
}
