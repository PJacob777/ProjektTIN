using System.ComponentModel.DataAnnotations;

namespace TINProjekt.Request;

public class RefreshTokenRequest
{
  [Required]
  public string RefreshToken { get; set; }
}
