using backend.Interfaces.Services;
using backend.Services.AI;
using backend.Services.Audit;
using backend.Services.Hash;
using backend.Services.Proof;

namespace backend.Extensions
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddScoped<IAuditService, AuditService>();
            services.AddHttpClient<IAIProvider, DeepSeekProvider>();
            services.AddScoped<IProofEngineService, ProofEngineService>();
            services.AddScoped<IHashService, HashService>();
            return services;
        }
    }
}
