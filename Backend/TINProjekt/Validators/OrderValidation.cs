using FluentValidation;
using TINProjekt.Request;

namespace TINProjekt.Validators;

public class OrderValidation : AbstractValidator<AddOrderRequest>
{
  public OrderValidation()
  {
    RuleFor(p => p.Products).NotEmpty().NotNull();
    RuleFor(p => p.Miasto).NotNull();
    RuleFor(p => p.Number).NotNull();
    RuleFor(p => p.Ulica).NotNull();
  }
}
