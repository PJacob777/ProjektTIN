using TINProjekt.Models;

namespace TINProjekt.Request;

public class AddOrderRequest
{
  public List<string> Products { get; set; }

  public string Miasto { get; set; }

  public string Ulica { get; set; }

  public string Number { get; set; }
}
