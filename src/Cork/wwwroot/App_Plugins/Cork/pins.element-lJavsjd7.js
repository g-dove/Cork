import { LitElement as h, html as n, css as _, state as d, customElement as p } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as m } from "@umbraco-cms/backoffice/element-api";
import { UMB_ACTION_EVENT_CONTEXT as f } from "@umbraco-cms/backoffice/action";
import { UmbRequestReloadStructureForEntityEvent as v } from "@umbraco-cms/backoffice/entity-action";
import { UMB_NOTIFICATION_CONTEXT as g } from "@umbraco-cms/backoffice/notification";
import { c as l } from "./client.gen-Ce7o8kG8.js";
var b = Object.defineProperty, y = Object.getOwnPropertyDescriptor, a = (e, t, r, s) => {
  for (var i = s > 1 ? void 0 : s ? y(t, r) : t, u = e.length - 1, c; u >= 0; u--)
    (c = e[u]) && (i = (s ? c(t, r, i) : c(i)) || i);
  return s && i && b(t, r, i), i;
};
let o = class extends m(h) {
  constructor() {
    super(...arguments), this._favourites = [], this._loading = !0, this._dragIndex = null, this._dragOverIndex = null, this._boundRefresh = () => this._loadFavourites();
  }
  connectedCallback() {
    super.connectedCallback(), this._loadFavourites(), window.addEventListener("cork-favourites-updated", this._boundRefresh), this.consumeContext(f, (e) => {
      this._actionEventContext = e, e && e.addEventListener(
        v.TYPE,
        this._boundRefresh
      );
    }), this.consumeContext(g, (e) => {
      this._notificationContext = e;
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener("cork-favourites-updated", this._boundRefresh), this._actionEventContext?.removeEventListener(
      v.TYPE,
      this._boundRefresh
    );
  }
  async _loadFavourites() {
    this._loading = !0;
    const { data: e, error: t } = await l.get({
      url: "/umbraco/cork/api/v1/favourites",
      query: { contentType: "content" },
      security: [{ scheme: "bearer", type: "http" }]
    });
    !t && e && (this._favourites = e), this._loading = !1;
  }
  _navigateToNode(e) {
    window.history.pushState(
      {},
      "",
      `/umbraco/section/content/workspace/document/edit/${e}`
    ), window.dispatchEvent(new PopStateEvent("popstate"));
  }
  async _removeFavourite(e, t) {
    e.stopPropagation();
    const { error: r } = await l.delete({
      url: "/umbraco/cork/api/v1/favourites/{nodeKey}",
      path: { nodeKey: t },
      security: [{ scheme: "bearer", type: "http" }]
    });
    r ? this._notificationContext?.peek("danger", {
      data: { headline: "Failed to remove favourite", message: "" }
    }) : this._notificationContext?.peek("positive", {
      data: { headline: "Removed from favourites", message: "" }
    }), this._loadFavourites(), window.dispatchEvent(new CustomEvent("cork-favourites-updated"));
  }
  _onDragStart(e, t) {
    this._dragIndex = e, t.dataTransfer && (t.dataTransfer.effectAllowed = "move");
  }
  _onDragOver(e, t) {
    t.preventDefault(), t.dataTransfer && (t.dataTransfer.dropEffect = "move"), this._dragOverIndex = e;
  }
  _onDragEnd() {
    if (this._dragIndex !== null && this._dragOverIndex !== null && this._dragIndex !== this._dragOverIndex) {
      const e = [...this._favourites], [t] = e.splice(this._dragIndex, 1);
      e.splice(this._dragOverIndex, 0, t), this._favourites = e, this._saveSortOrder();
    }
    this._dragIndex = null, this._dragOverIndex = null;
  }
  async _saveSortOrder() {
    await l.put({
      url: "/umbraco/cork/api/v1/favourites/sort",
      body: { nodeKeys: this._favourites.map((e) => e.nodeKey) },
      security: [{ scheme: "bearer", type: "http" }]
    });
  }
  render() {
    return this._loading ? n`` : this._favourites.length === 0 ? n`<uui-menu-item label="No favourites pinned" disabled></uui-menu-item>` : n`
      ${this._favourites.map(
      (e, t) => n`
          <div
            class="sortable-item ${this._dragOverIndex === t ? "drag-over" : ""}"
            draggable="true"
            @dragstart=${(r) => this._onDragStart(t, r)}
            @dragover=${(r) => this._onDragOver(t, r)}
            @dragend=${() => this._onDragEnd()}
          >
            <uui-menu-item
              label=${e.nodeName}
              @click-label=${() => this._navigateToNode(e.nodeKey)}
              class=${e.published ? "" : "draft"}
            >
              <uui-icon slot="icon" name="icon-document"></uui-icon>
              <uui-action-bar slot="actions">
                <uui-button
                  label="Remove"
                  @click=${(r) => this._removeFavourite(r, e.nodeKey)}
                >
                  <uui-icon name="icon-delete"></uui-icon>
                </uui-button>
              </uui-action-bar>
            </uui-menu-item>
          </div>
        `
    )}
    `;
  }
};
o.styles = [
  _`
      :host {
        display: contents;
      }

      .sortable-item {
        cursor: grab;
        transition: opacity 120ms ease;
      }

      .sortable-item.drag-over {
        border-top: 2px solid var(--uui-color-focus);
      }

      .draft {
          opacity: 0.6;
      }
    `
];
a([
  d()
], o.prototype, "_favourites", 2);
a([
  d()
], o.prototype, "_loading", 2);
a([
  d()
], o.prototype, "_dragIndex", 2);
a([
  d()
], o.prototype, "_dragOverIndex", 2);
o = a([
  p("cork-pins")
], o);
const T = o;
export {
  o as Pins,
  T as default
};
//# sourceMappingURL=pins.element-lJavsjd7.js.map
