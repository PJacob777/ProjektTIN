using System.ComponentModel.DataAnnotations;

namespace TINProjekt.Request;

public class AddProductRequest
{
  [Required]
  public string Name { get; set; }
  public string Description { get; set; }
  [Required]
  public Decimal Cost { get; set; }
}
