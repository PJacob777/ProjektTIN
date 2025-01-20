using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using TINProjekt.Exception;
using TINProjekt.Request;
using TINProjekt.Services;
using TINProjekt.Validators;

namespace TINProjekt.Controllers;
[ApiController]
[Route("api/[controller]")]
public class OrderController(IOrderService orderService, IValidator<AddOrderRequest> validator): ControllerBase
{
  [HttpPost("/order")]
  public async Task<IActionResult> CreateOrder([FromBody]AddOrderRequest orderRequest)
  {
    var validation = await validator.ValidateAsync(orderRequest);
    if (!validation.IsValid)
    {
      return ValidationProblem();
    }

    try
    {
      await orderService.MakeOrder(orderRequest);
    }
    catch (NotFoundUserException e)
    {
      return BadRequest();
    }
    catch (NotFoundProduct ex)
    {
      return BadRequest(ex.Message);
    }

    return NoContent();
  }
}
