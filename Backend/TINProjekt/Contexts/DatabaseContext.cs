using Microsoft.EntityFrameworkCore;
using TINProjekt.Models;

namespace TINProjekt.Contexts;

public class DatabaseContext : DbContext
{
  public DbSet<User> Users { get; set; }
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
