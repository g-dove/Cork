using Cork.Models;
using Umbraco.Cms.Infrastructure.Migrations;

namespace Cork.Migrations;

public class AddContentTypeToFavourites : AsyncMigrationBase
{
    public AddContentTypeToFavourites(IMigrationContext context) : base(context) { }

    protected override async Task MigrateAsync()
    {
        if (!ColumnExists(CorkFavourite.TableName, "contentType"))
        {
            await Database.ExecuteAsync($"ALTER TABLE {CorkFavourite.TableName} ADD COLUMN contentType TEXT NOT NULL");
        }
    }
}
