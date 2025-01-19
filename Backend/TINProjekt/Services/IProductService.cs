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
  Task AddProduct(AddProductRequest productRequest);
  Task UpdateProductName(string currentName, string newName);
  Task UpdateProductDescription(string name, string newDescription);
  Task UpdateProductCost(string name, Decimal newPrice);
  Task DeleteProduct(string name);
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

  public async Task AddProduct(AddProductRequest productRequest)
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

  public async Task UpdateProductName(string currentName,string newName)
  {
    if (string.IsNullOrWhiteSpace(currentName))
    {
      throw new ArgumentException("Current name cannot be null or empty.", nameof(currentName));
    }
    if (string.IsNullOrWhiteSpace(newName))
    {
      throw new ArgumentException("New name cannot be null or empty.", nameof(newName));
    }    var product = await databaseContext.Products.Where(c => c.Name == currentName).FirstOrDefaultAsync();
    if (product is null)
    {
      throw new NotFoundProduct("Nie ma takiego produktu");
    }

    product.Name = newName;
    await databaseContext.SaveChangesAsync();

  }

  public async Task UpdateProductDescription(string name, string newDescription)
  {
    if (string.IsNullOrWhiteSpace(newDescription))
    {
      throw new ArgumentException("Current name cannot be null or empty.", nameof(newDescription));
    }
    var toUpdate = await databaseContext.Products.Where(p => p.Name == name).FirstOrDefaultAsync();
    if (toUpdate is null)
    {
      throw new NotFoundProduct("Nie ma takiego produktu");
    }

    toUpdate.Description = newDescription;
    await databaseContext.SaveChangesAsync();

  }

  public async Task UpdateProductCost(string name, decimal newPrice)
  {
    if (newPrice == 0m)
    {
      throw new WrongPriceException("NIe można podać zerowej ceny");
    }

    var toUpdate = await databaseContext.Products.Where(p => p.Name == name).FirstOrDefaultAsync();
    if (toUpdate is null)
    {
      throw new NotFoundProduct("Nie ma takiego produktu");
    }

    toUpdate.Csst = newPrice;
    await databaseContext.SaveChangesAsync();
  }

  public async Task DeleteProduct(string name)
  {
    if (string.IsNullOrWhiteSpace(name))
    {
      throw new ArgumentException("Current name cannot be null or empty.", nameof(name));
    }

    var productToRemove = await databaseContext.Products.Where(p => p.Name == name).FirstOrDefaultAsync();
    if (productToRemove is null)
    {
      throw new NotFoundProduct("Nie ma takiego produktu");
    }

    databaseContext.Products.Remove(productToRemove);
    await databaseContext.SaveChangesAsync();
  }
}
