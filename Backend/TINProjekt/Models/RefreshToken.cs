namespace TINProjekt.Models;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


public class RefreshToken
{
  [Key]
  public int Id { get; set; }

  public string Token { get; set; }

  public DateTime ExpiryDate { get; set; }

  [ForeignKey("UserId")]
  public int UserId { get; set; }
  public User User { get; set; }
}
