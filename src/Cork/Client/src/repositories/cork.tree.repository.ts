import { UmbApi } from "@umbraco-cms/backoffice/extension-api";
import { UmbTreeRepositoryBase } from "@umbraco-cms/backoffice/tree";
import { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { CORK_TREE_ROOT_ITEM_TYPE } from "../entities/cork.tree.root.entity";
import { CorkTreeItemModel } from "../models/cork.tree.item.model";
import { CorkTreeRootModel } from "../models/cork.tree.root.model";

export class CorkTreeRepository extends
  UmbTreeRepositoryBase<CorkTreeItemModel, CorkTreeRootModel>
  implements UmbApi {

  constructor(host: UmbControllerHost) {
    super(host, CorkTreeServerDataSource, CORK_TREE_STORE_CONTEXT);

  async requestTreeRoot() {

      const data: CorkTreeRootModel = {
        unique: null,
        entityType: CORK_TREE_ROOT_ITEM_TYPE,
        name: 'time',
        hasChildren: true,
        isFolder: true,
      };

      return { data };
    }
  }
}
