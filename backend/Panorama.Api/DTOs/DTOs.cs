namespace Panorama.Api.DTOs;

// ===== Auth DTOs =====
public record LoginRequest(string Username, string Password);
public record LoginResponse(string Token, string RefreshToken, string Username, string Role, DateTime ExpiresAt);
public record TokenRequest(string Token, string RefreshToken);
public record RegisterRequest(string Username, string Email, string Password, string? FullName);

// ===== Category DTOs =====
public record CategoryTranslationDto(string Language, string Name, string? Description);

public record CategoryDto(
    int Id,
    string Slug,
    string Color,
    string? Icon,
    int SortOrder,
    bool IsActive,
    string Name, // resolved by language
    string? Description,
    int ArticleCount
);

public record CategoryCreateDto(
    string Slug,
    string Color,
    string? Icon,
    int SortOrder,
    List<CategoryTranslationDto> Translations
);

public record CategoryUpdateDto(
    string? Slug,
    string? Color,
    string? Icon,
    int? SortOrder,
    bool? IsActive,
    List<CategoryTranslationDto>? Translations
);

// ===== Article DTOs =====
public record ArticleTranslationDto(
    string Language,
    string Title,
    string? Summary,
    string? Content,
    string? MetaTitle,
    string? MetaDescription
);

public record ArticleDto(
    int Id,
    string Slug,
    string? FeaturedImage,
    bool IsBreaking,
    bool IsFeatured,
    bool IsPublished,
    int ViewCount,
    DateTime? PublishedAt,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    string Title, // resolved by language
    string? Summary,
    string? Content,
    CategoryDto? Category,
    AuthorDto? Author
);

public record ArticleListDto(
    int Id,
    string Slug,
    string? FeaturedImage,
    bool IsBreaking,
    bool IsFeatured,
    int ViewCount,
    DateTime? PublishedAt,
    string Title, // resolved by language
    string? Summary,
    string CategoryName,
    string CategorySlug,
    string CategoryColor,
    string AuthorName
);

public record ArticleCreateDto(
    int CategoryId,
    string Slug,
    string? FeaturedImage,
    bool IsBreaking,
    bool IsFeatured,
    bool IsPublished,
    List<ArticleTranslationDto> Translations
);

public record ArticleUpdateDto(
    int? CategoryId,
    string? Slug,
    string? FeaturedImage,
    bool? IsBreaking,
    bool? IsFeatured,
    bool? IsPublished,
    List<ArticleTranslationDto>? Translations
);

// ===== User DTOs =====
public record AuthorDto(int Id, string Username, string? FullName, string? AvatarUrl);

public record UserDto(
    int Id,
    string Username,
    string Email,
    string Role,
    string? FullName,
    string? AvatarUrl,
    bool IsActive,
    DateTime CreatedAt
);

public record UserCreateDto(string Username, string Email, string Password, string Role, string? FullName);
public record UserUpdateDto(string? Email, string? Password, string? Role, string? FullName, string? AvatarUrl, bool? IsActive);

// ===== Media DTOs =====
public record MediaFileDto(
    int Id,
    string FileName,
    string FilePath,
    string FileType,
    long FileSize,
    string? AltText,
    DateTime UploadedAt,
    string UploadedByName
);

// ===== Settings DTOs =====
public record SiteSettingDto(string Key, string? Value, string? Language);
public record SiteSettingUpdateDto(string Key, string? Value, string? Language);

// ===== Dashboard DTOs =====
public record DashboardDto(
    int TotalArticles,
    int PublishedArticles,
    int DraftArticles,
    int TotalCategories,
    int TotalUsers,
    int TotalMediaFiles,
    int TotalViews,
    List<ArticleListDto> RecentArticles,
    List<CategoryDto> TopCategories
);

// ===== Pagination =====
public record PagedResult<T>(
    List<T> Items,
    int TotalCount,
    int Page,
    int PageSize,
    int TotalPages
);
