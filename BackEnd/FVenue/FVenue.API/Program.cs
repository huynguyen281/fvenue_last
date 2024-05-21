using AutoMapper;
using BusinessObjects;
using DTOs.Repositories.Interfaces;
using DTOs.Repositories.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.IdentityModel.Tokens;
using Quartz;
using System.Text;
using FVenue.API.Jobs;

namespace FVenue.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllersWithViews().AddJsonOptions(
                options =>
                {
                    options.JsonSerializerOptions.AllowTrailingCommas = false;
                    options.JsonSerializerOptions.PropertyNameCaseInsensitive = false;
                    options.JsonSerializerOptions.PropertyNamingPolicy = null;
                });
            builder.Services.AddDbContext<DatabaseContext>();

            // Authentication
            builder.Services.AddSession();
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters()
                    {
                        // Validate JWT Issuer
                        ValidateIssuer = true,
                        ValidIssuer = builder.Configuration["JWT:Issuer"],
                        // Validate JWT Audience
                        ValidateAudience = true,
                        ValidAudience = builder.Configuration["JWT:Issuer"],
                        // Validate Token Expiry
                        ValidateLifetime = true,
                        // Validate Signing Key Matching 
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Key"])),
                    };
                });

            // Services
            builder.Services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            builder.Services.AddScoped<IAccountService, AccountService>();
            builder.Services.AddScoped<ICategoryService, CategoryService>();
            builder.Services.AddScoped<IEmailService, EmailService>();
            builder.Services.AddScoped<IImageService, ImageService>();
            builder.Services.AddScoped<IItemService, ItemService>();
            builder.Services.AddScoped<ILocationService, LocationService>();
            builder.Services.AddScoped<IPaymentService, PaymentService>();
            builder.Services.AddScoped<IQRService, QRService>();
            builder.Services.AddScoped<IRoleService, RoleService>();
            builder.Services.AddScoped<IScheduleService, ScheduleService>();
            builder.Services.AddScoped<ISubCategoryService, SubCategoryService>();
            builder.Services.AddScoped<ITokenService, TokenService>();
            builder.Services.AddScoped<IVenueService, VenueService>();
            builder.Services.AddScoped(
                provider => new MapperConfiguration(
                    config =>
                    {
                        config.AddProfile(new ProgramMapper(
                            provider.GetService<IAccountService>(),
                            provider.GetService<ICategoryService>(),
                            provider.GetService<ILocationService>(),
                            provider.GetService<ISubCategoryService>()
                            ));
                    })
                .CreateMapper());

            // Quartz Scheduler
            builder.Services.AddQuartz(quartz =>
            {
                /*
                 * B1: Tạo khóa (JobKey) cho công việc
                 * B2: Đăng kí công việc cần thực thi vào DI container với khóa vừa tạo
                 * B3: Thêm trigger cho công việc với cấu hình thời gian thực thi (Cron Expression)
                 */
                var jobKey = new JobKey("DeleteUnusedImagesJob");
                quartz.AddJob<DeleteUnusedImagesJob>(options => options.WithIdentity(jobKey));
                quartz.AddTrigger(options => options
                    .ForJob(jobKey)
                    .WithIdentity("DeleteUnusedImagesJob-Trigger")
                    .WithCronSchedule("0 0 0 ? * * *")
                );
            });
            builder.Services.AddQuartzHostedService(quartz => quartz.WaitForJobsToComplete = true);

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseSession();
            app.UseCors(options => options.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=AuthenticationMiddleware}/{id?}");

            app.Run();
        }
    }
}
