
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

builder.Configuration.AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);

builder.Configuration.AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true);

if (builder.Environment.IsDevelopment())
{
    builder.Configuration.AddUserSecrets<Program>();
}

builder.Configuration.AddEnvironmentVariables();


var blockchainSection = builder.Configuration.GetSection("Blockchain");

if (!blockchainSection.Exists() || string.IsNullOrEmpty(blockchainSection["RpcUrl"]))
{
    var rpcUrl = Environment.GetEnvironmentVariable("Blockchain__RpcUrl");
    var network = Environment.GetEnvironmentVariable("Blockchain__Network") ?? "Mainnet";

    if (!string.IsNullOrEmpty(rpcUrl))
    {
        builder.Configuration.AddInMemoryCollection(new Dictionary<string, string>
        {
            ["Blockchain:RpcUrl"] = rpcUrl,
            ["Blockchain:Network"] = network
        });

        blockchainSection = builder.Configuration.GetSection("Blockchain");

        Console.WriteLine($"✅ Blockchain loaded from Environment Variables: RpcUrl={rpcUrl}");
    }
    else
    {
        throw new InvalidOperationException(
            "Blockchain configuration is missing! Please set either:\n" +
            "1. 'Blockchain:RpcUrl' in appsettings.json\n" +
            "2. 'Blockchain__RpcUrl' Environment Variable\n" +
            "3. User-Secrets (only in Development)"
        );
    }
}

builder.Services.Configure<BlockchainSettings>(blockchainSection);


builder.Services.AddCors(options =>
{
    options.AddPolicy("WithAuthPolicy",
        policy =>
        {
            policy.WithOrigins(
                    "http://localhost:3000",
                    "http://127.0.0.1:3000",
                    "http://localhost:4200",
                    "http://localhost:5173",
                    "http://localhost:5174",
                    "https://proofhub-ai.yukaha.com",
                    "https://api-proofhub-ai.yukaha.com"
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
