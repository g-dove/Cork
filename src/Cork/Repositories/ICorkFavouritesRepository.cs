using Cork.Models;
using Umbraco.Cms.Infrastructure.Scoping;

namespace Cork.Repositories;

public interface ICorkFavouritesRepository
{
    public IEnumerable<CorkFavourite> GetFavourites(Guid userKey, string contentType);
    public void AddFavourite(Guid userKey, Guid nodeKey, string contentType);
    public void RemoveFavourite(Guid userKey, Guid nodeKey);
    public void RemoveFavouritesByNodeKey(Guid nodeKey);
    public void UpdateSortOrder(Guid userKey, IEnumerable<Guid> nodeKeys, string contentType);
}

public class CorkFavouritesRepository : ICorkFavouritesRepository
{
    private readonly IScopeProvider _scopeProvider;

    public CorkFavouritesRepository(IScopeProvider scopeProvider)
    {
        _scopeProvider = scopeProvider;
    }

    public IEnumerable<CorkFavourite> GetFavourites(Guid userKey, string contentType)
    {
        using var scope = _scopeProvider.CreateScope();
        var results = scope.Database.Fetch<CorkFavourite>(
            "WHERE userKey = @0 AND contentType = @1 ORDER BY sortOrder", userKey, contentType);
        scope.Complete();
        return results;
    }

    public void AddFavourite(Guid userKey, Guid nodeKey, string contentType)
    {
        using var scope = _scopeProvider.CreateScope();
        var existing = scope.Database.FirstOrDefault<CorkFavourite>(
            "WHERE userKey = @0 AND nodeKey = @1 AND contentType = @2", userKey, nodeKey, contentType);
        ;
        if (existing == null)
        {
            var maxSortOrder = scope.Database.ExecuteScalar<int>(
                $"SELECT COALESCE(MAX(sortOrder), -1) FROM {CorkFavourite.TableName} WHERE userKey = @0 AND contentType = @1", userKey, contentType);
            scope.Database.Insert(new CorkFavourite
            {
                UserKey = userKey,
                NodeKey = nodeKey,
                ContentType = contentType,
                SortOrder = maxSortOrder + 1,
            });
        }

        scope.Complete();
    }

    public void RemoveFavourite(Guid userKey, Guid nodeKey)
    {
        using var scope = _scopeProvider.CreateScope();
        scope.Database.Execute(
            $"DELETE FROM {CorkFavourite.TableName} WHERE userKey = @0 AND nodeKey = @1",
            userKey, nodeKey);
        scope.Complete();
    }

    public void RemoveFavouritesByNodeKey(Guid nodeKey)
    {
        using var scope = _scopeProvider.CreateScope();
        scope.Database.Execute(
            $"DELETE FROM {CorkFavourite.TableName} WHERE nodeKey = @0",
            nodeKey);
        scope.Complete();
    }

    public void UpdateSortOrder(Guid userKey, IEnumerable<Guid> nodeKeys, string contentType)
    {
        using var scope = _scopeProvider.CreateScope();
        var sortOrder = 0;
        foreach (var nodeKey in nodeKeys)
        {
            scope.Database.Execute(
                $"UPDATE {CorkFavourite.TableName} SET sortOrder = @0 WHERE userKey = @1 AND nodeKey = @2 AND contentType = @3",
                sortOrder, userKey, nodeKey);
            sortOrder++;
        }
        scope.Complete();
    }
}
