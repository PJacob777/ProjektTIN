using FluentValidation;
using TINProjekt.Request;

namespace TINProjekt.Validators;

public class OrderValidation : AbstractValidator<AddOrderRequest>
{
  public OrderValidation()
  {
    RuleFor(p => p.Products).NotEmpty().NotNull();
    RuleFor(p => p.Miasto).NotNull();
    RuleFor(p => p.Numer).NotNull();
    RuleFor(p => p.Ulica).NotNull();
    RuleFor(p => p.ID).NotNull().GreaterThan(0);
  }
}
