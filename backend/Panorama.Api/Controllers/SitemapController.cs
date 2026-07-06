using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Panorama.Api.Data;

namespace Panorama.Api.Controllers;

[ApiController]
public class SitemapController : ControllerBase
{
    private readonly AppDbContext _db;

    public SitemapController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("sitemap.xml")]
    [Produces("application/xml")]
    public async Task<IActionResult> GetSitemap()
    {
        var baseUrl = "http://localhost:5173"; // Frontend client URL

        var sitemapBuilder = new StringBuilder();
        sitemapBuilder.AppendLine("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
        sitemapBuilder.AppendLine("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">");

        // 1. Homepage
        sitemapBuilder.AppendLine("  <url>");
        sitemapBuilder.AppendLine($"    <loc>{baseUrl}/</loc>");
        sitemapBuilder.AppendLine($"    <lastmod>{DateTime.UtcNow:yyyy-MM-dd}</lastmod>");
        sitemapBuilder.AppendLine("    <changefreq>daily</changefreq>");
        sitemapBuilder.AppendLine("    <priority>1.0</priority>");
        sitemapBuilder.AppendLine("  </url>");

        // 2. About page
        sitemapBuilder.AppendLine("  <url>");
        sitemapBuilder.AppendLine($"    <loc>{baseUrl}/about</loc>");
        sitemapBuilder.AppendLine($"    <lastmod>{DateTime.UtcNow:yyyy-MM-dd}</lastmod>");
        sitemapBuilder.AppendLine("    <changefreq>monthly</changefreq>");
        sitemapBuilder.AppendLine("    <priority>0.5</priority>");
        sitemapBuilder.AppendLine("  </url>");

        // 3. Dynamic Categories
        var categories = await _db.Categories.Where(c => c.IsActive).ToListAsync();
        foreach (var cat in categories)
        {
            sitemapBuilder.AppendLine("  <url>");
            sitemapBuilder.AppendLine($"    <loc>{baseUrl}/category/{cat.Slug}</loc>");
            sitemapBuilder.AppendLine($"    <lastmod>{cat.CreatedAt:yyyy-MM-dd}</lastmod>");
            sitemapBuilder.AppendLine("    <changefreq>daily</changefreq>");
            sitemapBuilder.AppendLine("    <priority>0.8</priority>");
            sitemapBuilder.AppendLine("  </url>");
        }

        // 4. Dynamic Articles
        var articles = await _db.Articles.Where(a => a.IsPublished).ToListAsync();
        foreach (var art in articles)
        {
            var date = art.PublishedAt ?? art.CreatedAt;
            sitemapBuilder.AppendLine("  <url>");
            sitemapBuilder.AppendLine($"    <loc>{baseUrl}/article/{art.Slug}</loc>");
            sitemapBuilder.AppendLine($"    <lastmod>{date:yyyy-MM-dd}</lastmod>");
            sitemapBuilder.AppendLine("    <changefreq>weekly</changefreq>");
            sitemapBuilder.AppendLine("    <priority>0.6</priority>");
            sitemapBuilder.AppendLine("  </url>");
        }

        sitemapBuilder.AppendLine("</urlset>");

        return Content(sitemapBuilder.ToString(), "application/xml", Encoding.UTF8);
    }
}
