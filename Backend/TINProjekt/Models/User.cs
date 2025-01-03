using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TINProjekt.Models;
[Table("Users")]
public class User
{
  [Key]
  public int UserId { get; set; }

  public string Name { get; set; }

  [EmailAddress]
  public string Email { get; set; }

  public string PasswordHash { get; set; }

  public string Salt { get; set; }

  public string Role { get; set; }

  public List<Token> Tokens { get; set; }
}
