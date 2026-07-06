using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Panorama.Api.Services;

namespace Panorama.Api.Controllers.Admin;

[ApiController]
[Route("api/admin/media")]
[Authorize(Roles = "Admin,Editor")]
public class AdminMediaController : ControllerBase
{
    private readonly MediaService _mediaService;

    public AdminMediaController(MediaService mediaService)
    {
        _mediaService = mediaService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _mediaService.GetAllAsync();
        return Ok(result);
    }

    [HttpPost("upload")]
    public async Task<IActionResult> Upload(IFormFile file, [FromForm] string? altText)
    {
        var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
        var result = await _mediaService.UploadAsync(file, userId, altText);
        if (result == null)
            return BadRequest(new { message = "Fayl yükləmə uğursuz oldu. Yalnız şəkil faylları (jpeg, png, gif, webp, svg) qəbul edilir." });

        return Ok(result);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _mediaService.DeleteAsync(id);
        if (!result) return NotFound();
        return NoContent();
    }
}
