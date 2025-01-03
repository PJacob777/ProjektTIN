using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TINProjekt.Models;
[Table("Orders")]
public class Order
{

  [Key]
  public int Id { get; set; }

  public DateTime Date { get; set; }

  public Decimal Cost { get; set; }
  public string Miasto { get; set; }

  public string Ulica { get; set; }

  public string Number { get; set; }

  [ForeignKey("Client")]
  public int IdClient { get; set; }

  public Client Client { get; set; }

  public List<Product> Products { get; set; }
}
