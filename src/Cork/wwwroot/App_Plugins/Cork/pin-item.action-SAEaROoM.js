import { UmbEntityActionBase as i } from "@umbraco-cms/backoffice/entity-action";
class n extends i {
  constructor(t, e) {
    super(t, e);
  }
  async execute() {
    if (!this.args.unique) throw new Error("Unique is not available");
    if (!this.args.entityType) throw new Error("Entity Type is not available");
    console.log(this.args);
  }
}
export {
  n as PinItemAction,
  n as api
};
//# sourceMappingURL=pin-item.action-SAEaROoM.js.map
