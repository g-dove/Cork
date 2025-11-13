using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Api.Common.Attributes;
using Umbraco.Cms.Api.Common.ViewModels.Pagination;
using Umbraco.Cms.Web.Common.Authorization;
using Umbraco.Cms.Web.Common.Routing;

namespace Cork.Controllers.Tree
{
    [ApiController]
    [BackOfficeRoute($"cork/api/v{{version:apiVersion}}/tree")]
    [ApiExplorerSettings(GroupName = "Cork")]
    [Authorize(Policy = "New" + AuthorizationPolicies.BackOfficeAccess)]
    [MapToApi("cork")]
    public class CorkTreeControllerBase : Controller
    {
        public CorkTreeControllerBase()
        { }

        protected PagedViewModel<TItem> PagedViewModel<TItem>(IEnumerable<TItem> items, long totalItems)
            => new() { Items = items, Total = totalItems };

    }
}

