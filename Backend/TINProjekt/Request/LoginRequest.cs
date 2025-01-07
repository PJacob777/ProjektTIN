using System.ComponentModel.DataAnnotations;

namespace TINProjekt.Request;

public class LoginRequest
{
  [Required]
  [EmailAddress]
  public string UserName { get; set; }

  [Required]
  public string Password { get; set; }
}
