using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;
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

  [HttpGet]
  public async Task<IActionResult> GetAllProducts()
  {
    var listOfProducts = await productService.GetAllProducts();
    return Ok(listOfProducts);
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
      await productService.AddProduct(productRequest);
    }
    catch(AllreadyExistsException e)
    {
      return BadRequest("juz taki produkt istnieje");
    }

    return Ok();
  }
  [HttpPatch("/name")]
  public async Task<IActionResult> UpdateProductName(string name, string newName)
  {
    try
    {
      await productService.UpdateProductName(name, newName);
    }
    catch (NotFoundProduct ex)
    {
      return NotFound("Nie ma takiego produktu");
    }
    catch (ArgumentException ex)
    {
      return BadRequest();
    }
    return NoContent();
  }

  [HttpPatch("/description")]
  public async Task<IActionResult> UpdateProductDescription(string name, string newDesccription)
  {
    try
    {
      await productService.UpdateProductDescription(name, newDesccription);
    }
    catch (ArgumentException ex)
    {
      return BadRequest();
    }
    catch (NotFoundProduct ex)
    {
      return NotFound();
    }

    return NoContent();
  }

  [HttpPatch("/price")]
  public async Task<IActionResult> UpdateProductPrice(string name, decimal newPrice)
  {
    try
    {
      await productService.UpdateProductCost(name, newPrice);
    }
    catch (NotFoundProduct e)
    {
      return NotFound();
    }
    catch (WrongPriceException ex)
    {
      return BadRequest();
    }

    return NoContent();
  }

  [HttpDelete("/product")]
  public async Task<IActionResult> RemoveProduct(string name)
  {
    try
    {
      await productService.DeleteProduct(name);
    }
    catch (NotFoundProduct e)
    {
      return NotFound();
    }
    catch (ArgumentException e)
    {
      return BadRequest();
    }

    return NoContent();
  }
}
