using System.Text;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TINProjekt.Contexts;
using TINProjekt.Services;
using TINProjekt.Validators;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddCors(options =>
{
  options.AddDefaultPolicy(policy =>
  {
    policy.AllowAnyOrigin()  // Pozwala na żądania z dowolnej domeny
      .AllowAnyHeader()  // Pozwala na dowolne nagłówki
      .AllowAnyMethod(); // Pozwala na dowolne metody (GET, POST, itd.)
  });
});
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddValidatorsFromAssemblyContaining<ProductValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<OrderValidation>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IProductService,ProductService>();
builder.Services.AddDbContext<DatabaseContext>(opt =>
{
  opt.UseSqlServer(builder.Configuration.GetConnectionString("Default"));
});
builder.Services.AddAuthentication().AddJwtBearer(opt =>
{
  opt.TokenValidationParameters = new TokenValidationParameters
  {
    ValidateIssuer = true,
    ValidateAudience = true,
    ValidateLifetime = true,
    ValidateIssuerSigningKey = true,

    ValidIssuer = builder.Configuration["JWT:Issuer"],
    ValidAudience = builder.Configuration["JWT:Audience"],
    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Key"]!))
  };
});
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors();
app.UseAuthorization();
app.MapControllers();
app.Run();

