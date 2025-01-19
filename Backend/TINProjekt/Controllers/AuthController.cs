using FluentValidation;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using TINProjekt.Request;
using TINProjekt.Services;
using LoginRequest = TINProjekt.Request.LoginRequest;
using RegisterRequest = TINProjekt.Request.RegisterRequest;

[Route("api/[controller]")]
[ApiController]
public class AuthControler(IAuthService authService) : ControllerBase
{

  [HttpPost("login")]
  public async Task<IActionResult> Login(LoginRequest loginRequestModel)
  {
    if (!ModelState.IsValid)
      return BadRequest(ModelState);

    var response = await authService.LoginAsync(loginRequestModel);
    if (response != null)
    {
      return Ok(response);
    }
    return Unauthorized("Wrong username or password");
  }

  [HttpPost("refresh")]
  public async Task<IActionResult> RefreshToken(RefreshTokenRequest refreshTokenRequestModel)
  {
    var response = await authService.RefreshTokenAsync(refreshTokenRequestModel.RefreshToken);
    if (response != null)
    {
      return Ok(response);
    }
    return Unauthorized("Invalid token");
  }

  [HttpPost("register")]
  public async Task<IActionResult> Register(RegisterRequest registerRequestModel)
  {
    if (!ModelState.IsValid)
      return BadRequest(ModelState);

    var success = await authService.RegisterAsync(registerRequestModel);
    if (success)
    {
      return Ok("User registered successfully");
    }
    return BadRequest("Username already exists");
  }

}

