using Asp.Versioning;
using Cork.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Api.Common.ViewModels.Pagination;
using Umbraco.Cms.Api.Management.ViewModels;

namespace Cork.Controllers.Tree
{
    [ApiVersion("1.0")]
    public class CorkTreeChildrenController : CorkTreeControllerBase
    {
        public CorkTreeChildrenController() : base()
        { }

        [HttpGet]
        [MapToApiVersion("1.0")]
        [ProducesResponseType(typeof(PagedViewModel<CorkTreeItemResponseModel>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PagedViewModel<CorkTreeItemResponseModel>>> GetChildren(Guid parentId, int skip = 0, int take = 100)
        {
            var items = GetChildrenForParent(parentId);

            return Ok(PagedViewModel(items, items.Count()));
        }


        private IEnumerable<CorkTreeItemResponseModel> GetChildrenForParent(Guid? parentId)
        {
            yield return new CorkTreeItemResponseModel
            {
                Id = Guid.NewGuid(),
                HasChildren = false,
                Name = "Child item",
                Parent = parentId.HasValue
                    ? new ReferenceByIdModel
                    {
                        Id = parentId.Value,
                    }
                    : null
            };
        }
    }
}
