using DTR.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// 1. Add the Swagger generator to the services collection.
// This discovers the API endpoints and generates the OpenAPI specification.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IAttendanceService, AttendanceService>();
builder.Services.AddScoped<IDateTimeService, DateTimeService>();

var app = builder.Build();

// 2. Enable the Swagger middleware.
// This serves the generated OpenAPI specification as a JSON file.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(); // This serves the Swagger UI page.
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();