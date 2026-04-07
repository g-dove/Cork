import { UmbWorkspaceActionBase as i } from "@umbraco-cms/backoffice/workspace";
import { UMB_NOTIFICATION_CONTEXT as n } from "@umbraco-cms/backoffice/notification";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT as r } from "@umbraco-cms/backoffice/document";
import { c as s } from "./client.gen-Ce7o8kG8.js";
class v extends i {
  #e;
  #t;
  constructor(e, a) {
    super(e, a), this.consumeContext(n, (t) => {
      this.#e = t;
    }), this.consumeContext(r, (t) => {
      this.#t = t;
    });
  }
  async execute() {
    const e = this.#t?.getUnique();
    if (!e) {
      this.#e?.peek("warning", {
        data: { headline: "Save document first", message: "You cannot pin an unsaved document." }
      });
      return;
    }
    const { data: a, error: t } = await s.get({
      url: "/umbraco/cork/api/v1/favourites",
      query: { contentType: "content" },
      security: [{ scheme: "bearer", type: "http" }]
    });
    if (t) {
      this.#e?.peek("danger", {
        data: { headline: "Failed to check pin status", message: "" }
      });
      return;
    }
    if ((a ?? []).some((o) => o.nodeKey === e)) {
      const { error: o } = await s.delete({
        url: "/umbraco/cork/api/v1/favourites/{nodeKey}",
        path: { nodeKey: e },
        security: [{ scheme: "bearer", type: "http" }]
      });
      o ? this.#e?.peek("danger", {
        data: { headline: "Failed to unpin node", message: "" }
      }) : (this.#e?.peek("positive", {
        data: { headline: "Removed from favourites", message: "" }
      }), window.dispatchEvent(new CustomEvent("cork-favourites-updated")));
    } else {
      const { error: o } = await s.post({
        url: "/umbraco/cork/api/v1/favourites",
        body: { nodeKey: e, contentType: "content" },
        security: [{ scheme: "bearer", type: "http" }]
      });
      o ? this.#e?.peek("danger", {
        data: { headline: "Failed to pin node", message: "" }
      }) : (this.#e?.peek("positive", {
        data: { headline: "Added to favourites", message: "" }
      }), window.dispatchEvent(new CustomEvent("cork-favourites-updated")));
    }
  }
}
export {
  v as default
};
//# sourceMappingURL=workspaceaction.action-B5Prj3Fn.js.map
