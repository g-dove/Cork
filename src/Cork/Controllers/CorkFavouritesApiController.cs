using Asp.Versioning;
using Cork.Config;
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
    private readonly IFavouritesSettingsConfig _corkSettings;

    public CorkFavouritesApiController(
        ICorkFavouritesRepository favouritesRepository,
        IBackOfficeSecurityAccessor backOfficeSecurityAccessor,
        IContentService contentService,
        IFavouritesSettingsConfig corkSettings)
    {
        _favouritesRepository = favouritesRepository;
        _backOfficeSecurityAccessor = backOfficeSecurityAccessor;
        _contentService = contentService;
        _corkSettings = corkSettings;
    }

    private Guid GetCurrentUserKey()
    {
        var user = _backOfficeSecurityAccessor.BackOfficeSecurity?.CurrentUser;
        return user?.Key ?? throw new UnauthorizedAccessException("User not authenticated");
    }

    [HttpGet("favourites")]
    [ProducesResponseType<IEnumerable<FavouriteResponse>>(StatusCodes.Status200OK)]
    public IActionResult GetFavourites()
    {
        var userKey = GetCurrentUserKey();
        var favourites = _favouritesRepository.GetFavourites(userKey);

        var results = favourites
            .Select(f =>
            {
                var content = _contentService.GetById(f.NodeKey);
                return content != null
                    ? new FavouriteResponse { NodeKey = f.NodeKey, NodeName = content.Name ?? "Untitled", Published = content.Published }
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
        var favouritesCount = _favouritesRepository.GetFavourites(userKey).Count();

        if (favouritesCount >= _corkSettings.MaxLimit)
        {
            return BadRequest($"You can only have {_corkSettings.MaxLimit} favourites. Please remove one before adding another.");
        }

        _favouritesRepository.AddFavourite(userKey, request.NodeKey);
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
        _favouritesRepository.UpdateSortOrder(userKey, request.NodeKeys);
        return Ok();
    }
}

public class AddFavouriteRequest
{
    public Guid NodeKey { get; set; }
}

public class FavouriteResponse
{
    public Guid NodeKey { get; set; }
    public string NodeName { get; set; } = string.Empty;
    public bool Published { get; set; }
}

public class SortFavouritesRequest
{
    public List<Guid> NodeKeys { get; set; } = [];
}
