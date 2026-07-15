using DTR.Api.Middleware;
using DTR.Application.Interfaces;
using DTR.Application.Services;
using DTR.Infrastructure.Data;
using DTR.Infrastructure.Repositories;
using DTR.Infrastructure.Services;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database - Infrastructure
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")));

// Repositories - Infrastructure implements Application interfaces
builder.Services.AddScoped<IAttendanceRepository, AttendanceRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

// Services - Application layer
builder.Services.AddScoped<IAttendanceService, AttendanceService>();
builder.Services.AddScoped<IDateTimeService, DateTimeService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddSingleton<IJwtService, JwtService>(); // JwtService is stateless — Singleton is correct here

// JWT Authentication
var secretKey = builder.Configuration["JwtSettings:SecretKey"]!;

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            // Validate the signature using our secret key
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(secretKey)),

            // Validate issuer and audience match appsettings.json
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["JwtSettings:Issuer"],

            ValidateAudience = true,
            ValidAudience = builder.Configuration["JwtSettings:Audience"],

            // Validate token has not expired
            ValidateLifetime = true,

            // No clock skew — token expires exactly at exp time
            ClockSkew = TimeSpan.Zero
        };
    });

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Exception handling middleware should be registered early in the pipeline to catch exceptions from all downstream middleware and controllers
app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseHttpsRedirection();

// ORDER MATTERS — Authentication before Authorization
app.UseAuthentication();  // Who are you?
app.UseAuthorization();   // What are you allowed to do?

app.MapControllers();
app.Run();