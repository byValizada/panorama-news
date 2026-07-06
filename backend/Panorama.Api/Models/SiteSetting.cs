using System.ComponentModel.DataAnnotations;

namespace Panorama.Api.Models;

public class SiteSetting
{
    public int Id { get; set; }

    [Required, MaxLength(100)]
    public string Key { get; set; } = string.Empty;

    public string? Value { get; set; }

    [MaxLength(5)]
    public string? Language { get; set; } // null = global, "az"/"en"/"ru" = language-specific

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
