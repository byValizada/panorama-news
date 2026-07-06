using System.ComponentModel.DataAnnotations;

namespace Panorama.Api.Models;

public class MediaFile
{
    public int Id { get; set; }

    public int UploadedById { get; set; }

    [Required, MaxLength(255)]
    public string FileName { get; set; } = string.Empty;

    [Required, MaxLength(500)]
    public string FilePath { get; set; } = string.Empty;

    [MaxLength(100)]
    public string FileType { get; set; } = string.Empty; // image/jpeg, image/png, etc.

    public long FileSize { get; set; } // bytes

    [MaxLength(300)]
    public string? AltText { get; set; }

    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public User UploadedBy { get; set; } = null!;
}
