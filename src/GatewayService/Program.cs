using Microsoft.AspNetCore.Authentication.JwtBearer;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", builder =>
    {
        builder.WithOrigins("http://localhost:3000") // Allow only your Next.js app
               .AllowAnyMethod()                     // Allow any HTTP method (GET, POST, etc.)
               .AllowAnyHeader();                    // Allow any headers
    });
});

builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = builder.Configuration["IdentityServiceUrl"];
        options.RequireHttpsMetadata = false;
        options.TokenValidationParameters.ValidateAudience = false;
        options.TokenValidationParameters.NameClaimType = "username";
    });

// builder.Services.AddCors(options => 
// {
//     options.AddPolicy("customPolicy", b => 
//     {
//         b.AllowAnyHeader()
//             .AllowAnyMethod().AllowCredentials().WithOrigins(builder.Configuration["ClientApp"]);
//     });
// });

var app = builder.Build();

app.UseCors("AllowSpecificOrigin");

app.MapReverseProxy();

app.UseAuthentication();
app.UseAuthorization();

app.Run();
