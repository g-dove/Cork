import type { UmbTreeServerDataSourceBase } from "@umbraco-cms/backoffice/tree"
import { CorkTreeItemModel } from "../models/cork.tree.item.model.js";
export class CorkTreeServerDataSource extends UmbTreeServerDataSourceBase
  <CorkTreeItemResponseModel, CorkTreeItemModel> {

  constructor(host: UmbControllerHost) {
    const getRootItems = () => CorkResource.getRoot({});

    const getChildrenOf = (parentUnique: string | null) => {
      if (parentUnique == null) {
        return getRootItems();
      }
      else {
        return CorkResource.getChildren({ parentId: parentUnique });
      }
    };


    const mapper = (item: CorkTreeItemResponseModel): CorkTreeItemModel => {
      return {
        unique: item.id,
        parentUnique: item.parent?.id || null,
        name: item.name,
        entityType: CORK_TREE_ITEM_TYPE,
        hasChildren: item.hasChildren,
        isFolder: false,
        icon: 'icon-alarm-clock'
      };
    };

    super(host, {
      getRootItems,
      getChildrenOf,
      mapper
    });

    
  }
}
