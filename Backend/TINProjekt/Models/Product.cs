using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TINProjekt.Models;
[Table("Products")]
public class Product
{
  [Key]
  public int ID { get; set; }

  public string Name { get; set; }

  public string Description { get; set; }

  public Decimal Csst { get; set; }
  public string PictLink { get; set; }

  public List<Order> Orders { get; set; }
}
