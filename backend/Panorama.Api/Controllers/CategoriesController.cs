using Microsoft.AspNetCore.Mvc;
using Panorama.Api.Services;

namespace Panorama.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly CategoryService _categoryService;

    public CategoriesController(CategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string lang = "az")
    {
        var result = await _categoryService.GetAllAsync(lang);
        return Ok(result);
    }

    [HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug, [FromQuery] string lang = "az")
    {
        var result = await _categoryService.GetBySlugAsync(slug, lang);
        if (result == null) return NotFound();
        return Ok(result);
    }
}
