import type { UmbTreeRootModel } from "@umbraco-cms/backoffice/tree"
import { CorkTreeRootItemType } from "../entities/cork.tree.root.entity.ts"

export interface CorkTreeRootModel extends UmbTreeRootModel {
  entityType: CorkTreeRootItemType
}
