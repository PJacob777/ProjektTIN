using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace TINProjekt.Models;
[Table("Clients")]
public class Client
{

  [Key]
  public int ID { get; set; }
  public string Name { get; set; }
  public string Surname { get; set; }
  public string Address { get; set; }
  [EmailAddress]
  public string Email { get; set; }
  [MaxLength(9)]
  public string PhoneNumber { get; set; }

  public string? PESEL { get; set; }
  public List<Order> Orders { get; set; }
}
