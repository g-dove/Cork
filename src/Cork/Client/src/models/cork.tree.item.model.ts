import type { UmbTreeItemModel } from "@umbraco-cms/backoffice/tree"
import { CorkTreeItemType } from "../entities/cork.tree.item.entity.ts"

export interface CorkTreeItemModel extends UmbTreeItemModel {
  entityType: CorkTreeItemType
}
