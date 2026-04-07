using Umbraco.Cms.Core.Packaging;

namespace Cork.Migrations;

public class CorkMigrationPlan : PackageMigrationPlan
{
    public CorkMigrationPlan() : base("Cork") { }

    protected override void DefinePlan()
    {
        To<AddFavouritesTable>("cork-favourites-001");
        To<AddSortOrderToFavourites>("cork-favourites-002");
        To<AddContentTypeToFavourites>("cork-favourites-003");
    }
}
