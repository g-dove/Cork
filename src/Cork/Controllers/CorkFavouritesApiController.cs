using Asp.Versioning;
using Cork.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Core.Security;
using Umbraco.Cms.Core.Services;

namespace Cork.Controllers;

[ApiVersion("1.0")]
[ApiExplorerSettings(GroupName = "Cork")]
public class CorkFavouritesApiController : CorkApiControllerBase
{
    private readonly ICorkFavouritesRepository _favouritesRepository;
    private readonly IBackOfficeSecurityAccessor _backOfficeSecurityAccessor;
    private readonly IContentService _contentService;

    public CorkFavouritesApiController(
        ICorkFavouritesRepository favouritesRepository,
        IBackOfficeSecurityAccessor backOfficeSecurityAccessor,
        IContentService contentService)
    {
        _favouritesRepository = favouritesRepository;
        _backOfficeSecurityAccessor = backOfficeSecurityAccessor;
        _contentService = contentService;
    }

    private Guid GetCurrentUserKey()
    {
        var user = _backOfficeSecurityAccessor.BackOfficeSecurity?.CurrentUser;
        return user?.Key ?? throw new UnauthorizedAccessException("User not authenticated");
    }

    [HttpGet("favourites")]
    [ProducesResponseType<IEnumerable<FavouriteResponse>>(StatusCodes.Status200OK)]
    public IActionResult GetFavourites([FromQuery] string contentType)
    {
        var userKey = GetCurrentUserKey();
        var favourites = _favouritesRepository.GetFavourites(userKey, contentType);

        var results = favourites
            .Select(f =>
            {
                var content = _contentService.GetById(f.NodeKey);
                return content != null
                    ? new FavouriteResponse { NodeKey = f.NodeKey, ContentType = f.ContentType, NodeName = content.Name ?? "Untitled", Published = content.Published }
                    : null;
            })
            .Where(f => f != null)
            .ToList();

        return Ok(results);
    }

    [HttpPost("favourites")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult AddFavourite([FromBody] AddFavouriteRequest request)
    {
        var userKey = GetCurrentUserKey();
        _favouritesRepository.AddFavourite(userKey, request.NodeKey, request.ContentType);
        return Ok();
    }

    [HttpDelete("favourites/{nodeKey:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult RemoveFavourite(Guid nodeKey)
    {
        var userKey = GetCurrentUserKey();
        _favouritesRepository.RemoveFavourite(userKey, nodeKey);
        return Ok();
    }

    [HttpPut("favourites/sort")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult SortFavourites([FromBody] SortFavouritesRequest request)
    {
        var userKey = GetCurrentUserKey();
        _favouritesRepository.UpdateSortOrder(userKey, request.NodeKeys, request.ContentType);
        return Ok();
    }
}

public class AddFavouriteRequest
{
    public Guid NodeKey { get; set; }
    public string ContentType { get; set; } = string.Empty;
}

public class FavouriteResponse
{
    public Guid NodeKey { get; set; }
    public string ContentType { get; set; } = string.Empty;
    public string NodeName { get; set; } = string.Empty;
    public bool Published { get; set; }
}

public class SortFavouritesRequest
{
    public List<Guid> NodeKeys { get; set; } = [];
    public string ContentType { get; set; } = string.Empty;
}
