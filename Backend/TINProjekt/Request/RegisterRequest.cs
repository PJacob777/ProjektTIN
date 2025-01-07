using System.ComponentModel.DataAnnotations;

namespace TINProjekt.Request;

public class RegisterRequest
{
  [Required]
  [EmailAddress]
  public string UserName { get; set; }

  [Required]
  public string Password { get; set; }
  [Required]
  public string Role { get; set; }
}
