using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using TINProjekt.Contexts;
using TINProjekt.Exception;
using TINProjekt.Models;
using TINProjekt.Request;

namespace TINProjekt.Services;

public interface IProductService
{
  Task<Product> GetProduct(int id);
  Task<List<Product>> GetAllProducts();
  void AddProduct(AddProductRequest productRequest);
  void UpdateProduct(UpdateProductRequest request);
}

public class ProductService(DatabaseContext databaseContext) : IProductService
{
  public async Task<Product> GetProduct(int id)
  {
    var product = await databaseContext.Products.Where(p => p.ID == id).FirstOrDefaultAsync();
    return product;
  }

  public async Task<List<Product>> GetAllProducts()
  {
    var listOfProducts = await databaseContext.Products.ToListAsync();
    return listOfProducts;
  }

  public async void AddProduct(AddProductRequest productRequest)
  {
    var isOnDB = await databaseContext.Products.Where(c => c.Name == productRequest.Name).FirstOrDefaultAsync();
    if (isOnDB is not null)
    {
      throw new AllreadyExistsException("Juz istnieje");
    }
    await databaseContext.AddAsync(new Product()
      {
        Name = productRequest.Name,
        Description = productRequest.Description,
        Csst = productRequest.Cost,
      });

      await databaseContext.SaveChangesAsync();
  }

  public void UpdateProduct(UpdateProductRequest request)
  {

  }
}
