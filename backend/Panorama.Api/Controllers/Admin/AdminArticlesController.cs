using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Panorama.Api.DTOs;
using Panorama.Api.Services;

namespace Panorama.Api.Controllers.Admin;

[ApiController]
[Route("api/admin/articles")]
[Authorize(Roles = "Admin,Editor")]
public class AdminArticlesController : ControllerBase
{
    private readonly ArticleService _articleService;

    public AdminArticlesController(ArticleService articleService)
    {
        _articleService = articleService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string lang = "az",
        [FromQuery] int page = 1,
        [FromQuery] int size = 20)
    {
        var result = await _articleService.GetAllAdminAsync(lang, page, size);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id, [FromQuery] string lang = "az")
    {
        var result = await _articleService.GetByIdAdminAsync(id, lang);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ArticleCreateDto dto)
    {
        var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
        var result = await _articleService.CreateAsync(dto, userId);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] ArticleUpdateDto dto)
    {
        var result = await _articleService.UpdateAsync(id, dto);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _articleService.DeleteAsync(id);
        if (!result) return NotFound();
        return NoContent();
    }
}
