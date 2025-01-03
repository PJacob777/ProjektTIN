using System.ComponentModel.DataAnnotations.Schema;

namespace TINProjekt.Models;
[Table("Tokens")]
public class Token
{
  public int ID { get; set; }

  public string TokenResult { get; set; }

  public DateTime ExpireTime { get; set; }

  [ForeignKey("User")]
  public int UserID { get; set; }

  public User User { get; set; }
}
