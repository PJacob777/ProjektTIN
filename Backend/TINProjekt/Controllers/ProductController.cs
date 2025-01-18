using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using TINProjekt.Exception;
using TINProjekt.Request;
using TINProjekt.Services;

namespace TINProjekt.Controllers;
[Route("api/[controller]")]
[ApiController]
public class ProductController(IProductService productService, IValidator<AddProductRequest> productValidator) : ControllerBase
{
  [HttpGet("product/{id:int}")]
  public async Task<IActionResult> GetProduct(int id)
  {
    if (id <= 0)
    {
      return BadRequest();
    }
    var product = await productService.GetProduct(id);
    if (product is null)
    {
      return NotFound();
    }
    return Ok(product);
  }

  [HttpPost]
  public async Task<IActionResult> AddProduct([FromBody] AddProductRequest productRequest)
  {
    var validation = await productValidator.ValidateAsync(productRequest);
    if (!validation.IsValid)
    {
      return ValidationProblem();
    }

    try
    {
      productService.AddProduct(productRequest);
    }
    catch(AllreadyExistsException e)
    {
      return BadRequest("juz taki produkt istnieje");
    }

    return Ok();
  }
  [HttpPatch("{name:string}")]
  public async Task<IActionResult> UpdateProduct(string name)
  {
    return Ok();
  }
}
