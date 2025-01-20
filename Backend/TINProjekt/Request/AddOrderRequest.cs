using TINProjekt.Models;

namespace TINProjekt.Request;

public class AddOrderRequest
{
  public int ID { get; set; }
  public List<string> Products { get; set; }

  public string Miasto { get; set; }

  public string Ulica { get; set; }

  public string Numer { get; set; }
}
