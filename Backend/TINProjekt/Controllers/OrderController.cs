using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using TINProjekt.Request;

namespace TINProjekt.Controllers;
[ApiController]
[Route("api/[controller]")]
public class OrderController: ControllerBase
{
  [HttpGet("/order")]
  public async Task<IActionResult> CreateOrder(AddOrderRequest orderRequest)
  {
    return Ok();
  }
}
