using Microsoft.AspNetCore.Mvc;
using Panorama.Api.DTOs;
using Panorama.Api.Services;

namespace Panorama.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var result = await _authService.LoginAsync(request);
        if (result == null)
            return Unauthorized(new { message = "İstifadəçi adı və ya şifrə yanlışdır" });

        return Ok(result);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var result = await _authService.RegisterAsync(request);
        if (result == null)
            return BadRequest(new { message = "Bu istifadəçi adı və ya email artıq mövcuddur" });

        return Ok(result);
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] TokenRequest request)
    {
        var result = await _authService.RefreshTokenAsync(request);
        if (result == null)
            return BadRequest(new { message = "Geçərsiz refresh token və ya access token" });

        return Ok(result);
    }

    [HttpGet("me")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
        var result = await _authService.GetCurrentUserAsync(userId);
        if (result == null)
            return NotFound();

        return Ok(result);
    }
}
