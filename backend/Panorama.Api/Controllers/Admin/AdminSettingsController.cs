using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Panorama.Api.DTOs;
using Panorama.Api.Services;

namespace Panorama.Api.Controllers.Admin;

[ApiController]
[Route("api/admin/settings")]
[Authorize(Roles = "Admin")]
public class AdminSettingsController : ControllerBase
{
    private readonly SettingsService _settingsService;

    public AdminSettingsController(SettingsService settingsService)
    {
        _settingsService = settingsService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? lang = null)
    {
        var result = await _settingsService.GetAllAsync(lang);
        return Ok(result);
    }

    [HttpPut]
    public async Task<IActionResult> Update([FromBody] SiteSettingUpdateDto dto)
    {
        var result = await _settingsService.SetValueAsync(dto);
        return Ok(result);
    }

    [HttpPut("bulk")]
    public async Task<IActionResult> UpdateBulk([FromBody] List<SiteSettingUpdateDto> settings)
    {
        await _settingsService.SetBulkAsync(settings);
        return Ok(new { message = "Parametrlər uğurla yeniləndi" });
    }
}
