
using backend.Data;
using backend.Extensions;
using backend.Models.Config;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

var blockchainSection = builder.Configuration.GetSection("Blockchain");
if (!blockchainSection.Exists())
{
    throw new InvalidOperationException("Blockchain configuration section is missing!");
}

builder.Services.Configure<BlockchainSettings>(blockchainSection);

builder.Services.AddCors(options =>
{
    options.AddPolicy("WithAuthPolicy",
        policy =>
        {
            policy.WithOrigins(
                    "http://localhost:3000",
                    "http://localhost:4200",
                    "http://localhost:5173",
                    "https://proofhub-ai.yukaha.com"
                )
                .WithMethods("GET", "POST", "PUT", "DELETE")
                .WithHeaders(
                    "Content-Type",
                    "Authorization",
                    "X-Requested-With",
                    "Accept",
                    "Origin"
                )
                .AllowCredentials()  
                .SetPreflightMaxAge(TimeSpan.FromHours(24));
        });
});

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    });

builder.Services.AddApplicationServices();
builder.Services.AddHttpClient();

builder.Services.AddAuthorization();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new()
    {
        Title = "ProofHub API",
        Version = "v1"
    });
});

var app = builder.Build();



if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseCors("WithAuthPolicy");
app.MapControllers();

app.Run();
