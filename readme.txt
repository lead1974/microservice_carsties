dotnet new sln
# List existing NuGet sources
dotnet nuget remove source telerik ####https://nuget.telerik.com/nuget

dotnet restore
dotnet nuget locals all --clear

dotnet new webapi -o src/AuctionService

cd src/AuctionService
dotnet watch

dotnet tool install dotnet-ef -g
dotnet ef migrations add "InitialCreate" -o Data/Migrations

# after building docker-compose.yml file for postgres 
docker compose up -d

# now with postgres database up and running in docker container we can create tables
cd src/AuctionService
dotnet ef database update

# 13 - seeding database
dotnet ef database drop
dotnet watch

# 23 Search SearchService
dotnet new webapi -o src/SearchService 
dotnet sln add src/SearchService
nuget: install mongodb.entities, automapper dependencyinjections
dotnet build - to verify project works, no errors

# install mongodb
# insert entry for mongodb in docker-compose.yml
docker compose up -d
# 24 install mongodb for vscode extension and connect using setup in docker-compose.yml
  mongodb:
    image: mongo
    environment:
      - MONGO_INITDB_ROOT_USERNAME=
      - MONGO_INITDB_ROOT_PASSWORD=
# 27 https://mongodb-entities.com/
# 31 adding SearchService/Services/AuctionSvcHttpClient.cs
# delete mongodb inside docker client, stop the SearchService
# restart docker : docker compose up -d
docker volume list
DRIVER    VOLUME NAME
local     carsties_mongodata
local     carsties_pgdata
# to remove mongodb from docker instance: 
docker volume rm carsties_mongodata

# take docker down
docker compose down

# 32 nuget install Microsoft.Extensions.Http.Polly into SearchService
# using polly to continue retry AuctionService every 3 seconds until AuctionService is backup and running
# in SerachService.Program.cs:
static IAsyncPolicy<HttpResponseMessage> GetPolicy()
    => HttpPolicyExtensions
        .HandleTransientHttpError()
        .OrResult(msg => msg.StatusCode == HttpStatusCode.NotFound)
        .WaitAndRetryForeverAsync(_ => TimeSpan.FromSeconds(3));
# adding app.Lifetime.ApplicationStarted.Register to ensure SearchService is started!

# 36 RabbitMQ http://localhost:15672/#/ u/p : guest/guest
# 37 https://masstransit.io/documentation
# adding class library for RabbitMQ Contracts between Auction and Search Services
dotnet new classlib -o src/Contracts
dotnet sln add src/Contracts //add to solution
# add Contracts as a project reference:
cd src/AuctionService
dotnet add reference ../../src/Contracts

# 42 adding a message outbox for RabbitMQ
dotnet ef migrations add Outbox

# 50 Identity Server
dotnet new install Duende.IdentityServer.Templates
# we need : Duende IdentityServer with ASP.NET Core Identity            isaspid        [C#]      Web/IdentityServer
# create new service project
dotnet new isaspid -o src/IdentityService
dotnet sln add src/IdentityService

# 52 migrating to postgresdb instead of sqllite
remove Migration folder from IdentityService
dotnet ef migrations add "InitialCreate" -o Data/Migrations

# 63 adding Gateway service
dotnet new web -o src/GatewayService
dotnet sln add src/GatewayService
nuget: install Yarp.ReverseProxy

# 74 Dockerizing AuctionService
# create Dockerfile and run in sln level directory 
docker build -f src/AuctionService/Dockerfile -t testing123 .
# 75 modify docker-compose.yml file
docker compose build auction-svc
docker compose down 
docker compose up -d

# 83 Creating NextJS project
npx create-next-app@latest
npm run dev


npm install react-icons
npm install next-auth
npm install flowbite-react
npm install react-countdown
npm install @tailwindcss/aspect-ratio
npm install cors
npm install zustand - state managment
npm install query-string -- allows 


