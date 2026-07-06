using Microsoft.AspNetCore.Mvc;
using Panorama.Api.DTOs;
using Panorama.Api.Services;

namespace Panorama.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ArticlesController : ControllerBase
{
    private readonly ArticleService _articleService;

    public ArticlesController(ArticleService articleService)
    {
        _articleService = articleService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string lang = "az",
        [FromQuery] int page = 1,
        [FromQuery] int size = 20)
    {
        var result = await _articleService.GetPublishedAsync(lang, page, size);
        return Ok(result);
    }

    [HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug, [FromQuery] string lang = "az")
    {
        var result = await _articleService.GetBySlugAsync(slug, lang);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpGet("featured")]
    public async Task<IActionResult> GetFeatured([FromQuery] string lang = "az", [FromQuery] int count = 5)
    {
        var result = await _articleService.GetFeaturedAsync(lang, count);
        return Ok(result);
    }

    [HttpGet("breaking")]
    public async Task<IActionResult> GetBreaking([FromQuery] string lang = "az", [FromQuery] int count = 10)
    {
        var result = await _articleService.GetBreakingAsync(lang, count);
        return Ok(result);
    }

    [HttpGet("trending")]
    public async Task<IActionResult> GetTrending([FromQuery] string lang = "az", [FromQuery] int count = 10)
    {
        var result = await _articleService.GetTrendingAsync(lang, count);
        return Ok(result);
    }

    [HttpGet("latest")]
    public async Task<IActionResult> GetLatest([FromQuery] string lang = "az", [FromQuery] int count = 10)
    {
        var result = await _articleService.GetLatestAsync(lang, count);
        return Ok(result);
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search(
        [FromQuery] string q = "",
        [FromQuery] string lang = "az",
        [FromQuery] int page = 1,
        [FromQuery] int size = 20)
    {
        if (string.IsNullOrWhiteSpace(q))
            return BadRequest(new { message = "Axtarış sorğusu boş ola bilməz" });

        var result = await _articleService.SearchAsync(q, lang, page, size);
        return Ok(result);
    }

    [HttpGet("category/{categorySlug}")]
    public async Task<IActionResult> GetByCategory(
        string categorySlug,
        [FromQuery] string lang = "az",
        [FromQuery] int page = 1,
        [FromQuery] int size = 20)
    {
        var result = await _articleService.GetByCategoryAsync(categorySlug, lang, page, size);
        return Ok(result);
    }
}
