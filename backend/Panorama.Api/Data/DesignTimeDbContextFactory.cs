using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Panorama.Api.Data;

public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
        
        // Try to read environment variable or default to SQLite
        var connString = Environment.GetEnvironmentVariable("CONNECTION_STRING") ?? "Data Source=panorama.db";
        
        if (connString.Contains("Host=") || connString.Contains("Server=") || connString.Contains("Port="))
        {
            optionsBuilder.UseNpgsql(connString);
        }
        else
        {
            optionsBuilder.UseSqlite(connString);
        }

        return new AppDbContext(optionsBuilder.Options);
    }
}
