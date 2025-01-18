using Microsoft.EntityFrameworkCore;
using TINProjekt.Models;

namespace TINProjekt.Contexts;

public class DatabaseContext : DbContext
{
  public DbSet<User> Users { get; set; }
  public DbSet<RefreshToken> RefreshTokens { get; set; }
  public DbSet<Client> Clients { get; set; }
  public DbSet<Order> Order { get; set; }
  public DbSet<Product> Products { get; set; }
  public DbSet<Token> Tokens { get; set; }

  protected DatabaseContext()
  {

  }

  public DatabaseContext(DbContextOptions options) : base(options)
  {

  }

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    base.OnModelCreating(modelBuilder);
  }

}
