using AuctionService;
using AuctionService.Data;
using MassTransit;
using Microsoft.EntityFrameworkCore;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddControllers();
//builder.Services.AddEndpointsApiExplorer();
builder.Services.AddDbContext<AuctionDbContext>(opt =>
{
    opt.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
builder.Services.AddMassTransit(x =>
{
    x.AddEntityFrameworkOutbox<AuctionDbContext>(o =>
    {
        o.QueryDelay = TimeSpan.FromSeconds(10);
        o.UsePostgres();
        o.UseBusOutbox();
    });

    x.AddConsumersFromNamespaceContaining<AuctionCreatedFaultConsumer>();
    x.SetEndpointNameFormatter(new KebabCaseEndpointNameFormatter("auction", false));

    x.UsingRabbitMq((context, cfg) =>
    {
        // cfg.UseRetry(r => 
        // {
        //     r.Handle<RabbitMqConnectionException>();
        //     r.Interval(5, TimeSpan.FromSeconds(10));
        // });

        // cfg.Host(builder.Configuration["RabbitMq:Host"], "/", host =>
        // {
        //     host.Username(builder.Configuration.GetValue("RabbitMq:Username", "guest"));
        //     host.Password(builder.Configuration.GetValue("RabbitMq:Password", "guest"));
        // });

        cfg.ConfigureEndpoints(context);
    });
});


builder.Services.AddScoped<IAuctionRepository, AuctionRepository>();
var app = builder.Build();

app.UseAuthorization();
app.MapControllers();

try
{
    DbInitializer.InitDb(app);
}
catch (PostgresException ex)
{
    Console.WriteLine(ex.Message);
}
catch (Exception ex)
{
    Console.WriteLine(ex.Message);
}


app.Run();

