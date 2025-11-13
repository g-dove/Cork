using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Umbraco.Cms.Api.Management.ViewModels;

namespace Cork.Models
{
    public class CorkTreeItemResponseModel
    {
        public Guid Id { get; set; }

        public ReferenceByIdModel? Parent { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Type { get; set; } = string.Empty;


        public bool HasChildren { get; set; }
    }

}
