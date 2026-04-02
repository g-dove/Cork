import { LitElement as C, html as k, css as y, property as b, state as m, customElement as P } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as E } from "@umbraco-cms/backoffice/element-api";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT as x } from "@umbraco-cms/backoffice/document";
import { c as O } from "./client.gen-Ce7o8kG8.js";
var W = Object.defineProperty, M = Object.getOwnPropertyDescriptor, w = (t) => {
  throw TypeError(t);
}, u = (t, e, i, o) => {
  for (var n = o > 1 ? void 0 : o ? M(e, i) : e, l = t.length - 1, d; l >= 0; l--)
    (d = t[l]) && (n = (o ? d(e, i, n) : d(n)) || n);
  return o && n && W(e, i, n), n;
}, v = (t, e, i) => e.has(t) || w("Cannot " + i), p = (t, e, i) => (v(t, e, "read from private field"), e.get(t)), h = (t, e, i) => e.has(t) ? w("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, i), U = (t, e, i, o) => (v(t, e, "write to private field"), e.set(t, i), i), _ = (t, e, i) => (v(t, e, "access private method"), i), r, c, s, f, g;
let a = class extends E(C) {
  constructor() {
    super(), h(this, s), this._isPinned = !1, this._loading = !0, h(this, r), h(this, c, () => _(this, s, f).call(this)), this.consumeContext(x, (t) => {
      U(this, r, t), _(this, s, f).call(this);
    });
  }
  connectedCallback() {
    super.connectedCallback(), window.addEventListener("cork-favourites-updated", p(this, c));
  }
  disconnectedCallback() {
    window.removeEventListener("cork-favourites-updated", p(this, c)), super.disconnectedCallback();
  }
  render() {
    if (this._loading)
      return k`<uui-button look="outline" disabled label="Loading..."></uui-button>`;
    const t = this._isPinned ? "Unfavourite" : "Favourite", e = this._isPinned ? "icon-wrong" : "icon-pushpin";
    return k`
      <uui-button
        @click=${_(this, s, g)}
        look="outline"
        color="default"
        label=${t}
        compact=""
        class="cork-workspace-button"
      >
        <uui-icon name=${e}></uui-icon>
        <span>${t}</span>
      </uui-button>
    `;
  }
};
r = /* @__PURE__ */ new WeakMap();
c = /* @__PURE__ */ new WeakMap();
s = /* @__PURE__ */ new WeakSet();
f = async function() {
  const t = p(this, r)?.getUnique(), e = p(this, r)?.getIsNew();
  if (!t || e) {
    this._loading = !1;
    return;
  }
  const { data: i } = await O.get({
    url: "/umbraco/cork/api/v1/favourites",
    query: { contentType: "content" },
    security: [{ scheme: "bearer", type: "http" }]
  }), o = i ?? [];
  this._isPinned = o.some((n) => n.nodeKey === t), this._loading = !1;
};
g = async function() {
  this.api && (this._loading = !0, await this.api.execute(), this._loading = !1);
};
a.styles = y`
    .cork-workspace-button span {
      margin: 0 6px 0 2px;
    }

    .cork-workspace-button uui-icon {
      margin-left: 3px;
    }
  `;
u([
  b({ attribute: !1 })
], a.prototype, "api", 2);
u([
  m()
], a.prototype, "_isPinned", 2);
u([
  m()
], a.prototype, "_loading", 2);
a = u([
  P("cork-pin-workspace-action")
], a);
export {
  a as default
};
//# sourceMappingURL=workspaceaction.element-Ds1GyM1v.js.map
