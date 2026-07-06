using Microsoft.AspNetCore.Mvc;
using Panorama.Api.Services;

namespace Panorama.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SettingsController : ControllerBase
{
    private readonly SettingsService _settingsService;

    public SettingsController(SettingsService settingsService)
    {
        _settingsService = settingsService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? lang = null)
    {
        var result = await _settingsService.GetAllAsync(lang);
        return Ok(result);
    }

    [HttpGet("{key}")]
    public async Task<IActionResult> GetValue(string key, [FromQuery] string? lang = null)
    {
        var result = await _settingsService.GetValueAsync(key, lang);
        return Ok(new { key, value = result, lang });
    }
}
