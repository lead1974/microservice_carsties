dotnet new sln
# List existing NuGet sources
dotnet nuget remove source telerik ####https://nuget.telerik.com/nuget

dotnet restore
dotnet nuget locals all --clear

dotnet new webapi -o src/AuctionService

cd src/AuctionService
dotnet watch

