using System.Globalization;
using Asp.Versioning;
using Cork.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Api.Common.ViewModels.Pagination;
using Umbraco.Extensions;

namespace Cork.Controllers.Tree
{

    [ApiVersion("1.0")]
    public class CorkTreeRootController : CorkTreeControllerBase
    {
        public CorkTreeRootController() : base()
        { }

        [HttpGet("root")]
        [MapToApiVersion("1.0")]
        [ProducesResponseType(typeof(PagedViewModel<CorkTreeItemResponseModel>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PagedViewModel<CorkTreeItemResponseModel>>> GetRoot(int skip = 0, int take = 100)
        {
            var items = GetTreeItems();
            var result = PagedViewModel(items, items.Count());

            return base.Ok(result);
        }

        private static string[] _cultures = [
            "en-US",
            "fr-fr",
            "en-GB"
        ];

        /// <summary>
        ///  dummy method to get us some tree items. 
        /// </summary>
        /// <returns></returns>
        private IEnumerable<CorkTreeItemResponseModel> GetTreeItems()
        {
            foreach (var culture in _cultures)
            {
                var cultureInfo = CultureInfo.GetCultureInfo(culture);

                yield return new CorkTreeItemResponseModel
                {
                    Id = cultureInfo.Name.ToGuid(),
                    HasChildren = false,
                    Name = cultureInfo.Name,
                };
            }
        }
    }

}
