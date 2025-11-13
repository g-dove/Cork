export class CorkTreeStore extends UmbUniqueTreeStore {

  constructor(host: UmbControllerHostElement) {
    super(host, CORK_TREE_STORE_CONTEXT.toString());

    new UmbStoreConnector<CorkTreeItemModel, CorkTreeDetailModel>(
      host,
      this,
      CORK_TREE_STORE_CONTEXT,
      (item) => this.#createTreeMapper(item),
      (item) => this.#updateTreeItemMapper(item)
    )
  }

  #createTreeMapper = (item: CorkTreeDetailModel) => {
    const treeItem: CorkTreeItemModel = {
      unique: item.unique,
      parentUnique: null,
      name: item.name,
      entityType: item.entityType,
      isFolder: false,
      hasChildren: false
    };

    return treeItem;
  };

  #updateTreeItemMapper = (model: CorkTreeDetailModel) => {
    return {
      name: model.name
    };
  };
}
