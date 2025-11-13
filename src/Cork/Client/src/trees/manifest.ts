import { CORK_TREE_REPOSITORY_ALIAS, CORK_TREE_ALIAS } from "../constants/constants";
import { CORK_TREE_ROOT_ITEM_TYPE } from "../entities/cork.tree.root.entity";
import { CORK_TREE_ITEM_TYPE } from "../entities/cork.tree.item.entity";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: 'tree',
    alias: CORK_TREE_ALIAS,
    name: 'Cork tree',
    meta: {
      repositoryAlias: CORK_TREE_REPOSITORY_ALIAS
    }
  },
];

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: 'treeItem',
    kind: 'unique',
    alias: 'Cork.Tree.RootItem',
    name: 'Cork Tree Item',
    meta: {
      entityTypes: [
        CORK_TREE_ROOT_ITEM_TYPE,
        CORK_TREE_ITEM_TYPE
      ]
    }
  },
];
