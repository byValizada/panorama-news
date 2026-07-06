using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Panorama.Api.DTOs;
using Panorama.Api.Services;

namespace Panorama.Api.Controllers.Admin;

[ApiController]
[Route("api/admin/categories")]
[Authorize(Roles = "Admin,Editor")]
public class AdminCategoriesController : ControllerBase
{
    private readonly CategoryService _categoryService;

    public AdminCategoriesController(CategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string lang = "az")
    {
        var result = await _categoryService.GetAllAdminAsync(lang);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CategoryCreateDto dto)
    {
        var result = await _categoryService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetAll), result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CategoryUpdateDto dto)
    {
        var result = await _categoryService.UpdateAsync(id, dto);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _categoryService.DeleteAsync(id);
        if (!result) return BadRequest(new { message = "Kateqoriyanı silmək mümkün deyil. İçərisində xəbərlər var." });
        return NoContent();
    }
}
