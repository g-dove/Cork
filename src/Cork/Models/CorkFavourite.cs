using NPoco;
using Umbraco.Cms.Infrastructure.Persistence.DatabaseAnnotations;

namespace Cork.Models;

[TableName("corkFavourite")]
[PrimaryKey("id", AutoIncrement = true)]
public class CorkFavourite
{
    public const string TableName = "corkFavourite";

    [PrimaryKeyColumn(AutoIncrement = true)]
    [Column("id")]
    public int Id { get; set; }

    [Column("userKey")]
    public Guid UserKey { get; set; }

    [Column("nodeKey")]
    public Guid NodeKey { get; set; }

    [Column("contentType")]
    public string ContentType { get; set; } = string.Empty;

    [Column("sortOrder")]
    public int SortOrder { get; set; }
}
