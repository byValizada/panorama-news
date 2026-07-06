using Microsoft.EntityFrameworkCore;
using Panorama.Api.Models;

namespace Panorama.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<CategoryTranslation> CategoryTranslations => Set<CategoryTranslation>();
    public DbSet<Article> Articles => Set<Article>();
    public DbSet<ArticleTranslation> ArticleTranslations => Set<ArticleTranslation>();
    public DbSet<MediaFile> MediaFiles => Set<MediaFile>();
    public DbSet<SiteSetting> SiteSettings => Set<SiteSetting>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(u => u.Username).IsUnique();
            entity.HasIndex(u => u.Email).IsUnique();
        });

        // Category
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasIndex(c => c.Slug).IsUnique();
        });

        // CategoryTranslation
        modelBuilder.Entity<CategoryTranslation>(entity =>
        {
            entity.HasIndex(ct => new { ct.CategoryId, ct.Language }).IsUnique();
            entity.HasOne(ct => ct.Category)
                  .WithMany(c => c.Translations)
                  .HasForeignKey(ct => ct.CategoryId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Article
        modelBuilder.Entity<Article>(entity =>
        {
            entity.HasIndex(a => a.Slug).IsUnique();
            entity.HasOne(a => a.Category)
                  .WithMany(c => c.Articles)
                  .HasForeignKey(a => a.CategoryId)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(a => a.Author)
                  .WithMany(u => u.Articles)
                  .HasForeignKey(a => a.AuthorId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // ArticleTranslation
        modelBuilder.Entity<ArticleTranslation>(entity =>
        {
            entity.HasIndex(at => new { at.ArticleId, at.Language }).IsUnique();
            entity.HasOne(at => at.Article)
                  .WithMany(a => a.Translations)
                  .HasForeignKey(at => at.ArticleId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // MediaFile
        modelBuilder.Entity<MediaFile>(entity =>
        {
            entity.HasOne(m => m.UploadedBy)
                  .WithMany(u => u.MediaFiles)
                  .HasForeignKey(m => m.UploadedById)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // SiteSetting
        modelBuilder.Entity<SiteSetting>(entity =>
        {
            entity.HasIndex(s => new { s.Key, s.Language }).IsUnique();
        });
    }
}
