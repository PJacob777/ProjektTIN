using Microsoft.EntityFrameworkCore;
using TINProjekt.Contexts;
using TINProjekt.Exception;
using TINProjekt.Models;
using TINProjekt.Request;

namespace TINProjekt.Services;

public interface IOrderService
{
  public Task MakeOrder(AddOrderRequest addOrderRequest);
}

public class OrderService(DatabaseContext databaseContext) : IOrderService
{
  public async Task MakeOrder(AddOrderRequest addOrderRequest)
  {
    var user = await databaseContext.Users.FindAsync(addOrderRequest.ID);
    if (user is null)
    {
      throw new NotFoundUserException("User not found.");
    }
    var products = await databaseContext.Products
      .Where(p => addOrderRequest.Products.Contains(p.Name))
      .ToListAsync();

    if (!products.Any())
    {
      throw new NotFoundProduct("No valid products found.");
    }
    var order = new Order
    {
      IdClient = addOrderRequest.ID,
      Date = DateTime.UtcNow,
      Miasto = addOrderRequest.Miasto,
      Ulica = addOrderRequest.Ulica,
      Number = addOrderRequest.Numer,
    };


    order.Products = products;

    databaseContext.Order.Add(order);
    await databaseContext.SaveChangesAsync();
  }
}
