using FluentValidation;
using TINProjekt.Request;

namespace TINProjekt.Validators;

public class ProductValidator : AbstractValidator<AddProductRequest>
{
  public ProductValidator()
  {
    RuleFor(p => p.Name).NotNull();
    RuleFor(p => p.Name).NotNull().NotEmpty();
  }
}
