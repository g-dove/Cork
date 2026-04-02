import { LitElement, html, css, customElement, state, property } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT } from "@umbraco-cms/backoffice/document";
import { client } from "../api/client.gen.js";
import type CorkPinWorkspaceAction from "./workspaceaction.action.js";

interface FavouriteItem {
  nodeKey: string;
  nodeName: string;
  published: boolean;
}

@customElement("cork-pin-workspace-action")
export default class CorkPinWorkspaceActionElement extends UmbElementMixin(LitElement) {
  
  // Umbraco automatically passes the initialized API class into this property
  @property({ attribute: false })
  public api?: CorkPinWorkspaceAction;

  @state()
  private _isPinned = false;

  @state()
  private _loading = true;

  #workspaceContext?: typeof UMB_DOCUMENT_WORKSPACE_CONTEXT.TYPE;
  #onFavouritesUpdated = () => this.#checkPinStatus();

  constructor() {
    super();

    this.consumeContext(UMB_DOCUMENT_WORKSPACE_CONTEXT, (ctx) => {
      this.#workspaceContext = ctx;
      this.#checkPinStatus();
    });
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("cork-favourites-updated", this.#onFavouritesUpdated);
  }

  disconnectedCallback() {
    window.removeEventListener("cork-favourites-updated", this.#onFavouritesUpdated);
    super.disconnectedCallback();
  }

  async #checkPinStatus() {
    const unique = this.#workspaceContext?.getUnique();
    const isNew = this.#workspaceContext?.getIsNew();

    if (!unique || isNew) {
      this._loading = false;
      return;
    }

    const { data } = await client.get({
      url: "/umbraco/cork/api/v1/favourites",
      query: { contentType: 'content' },
      security: [{ scheme: "bearer", type: "http" }],
    });

    const favourites = (data as FavouriteItem[]) ?? [];
    this._isPinned = favourites.some((f) => f.nodeKey === unique);
    this._loading = false;
  }

  async #onClick() {
    if (!this.api) return;

    this._loading = true;
    
    // Delegate the actual heavy-lifting back to the workspace action api class
    await this.api.execute();
    
    this._loading = false;
  }

  static styles = css`
    .cork-workspace-button span {
      margin: 0 6px 0 2px;
    }

    .cork-workspace-button uui-icon {
      margin-left: 3px;
    }
  `

  render() {
    if (this._loading) {
      return html`<uui-button look="outline" disabled label="Loading..."></uui-button>`;
    }

    const label = this._isPinned ? "Unfavourite" : "Favourite";
    const icon = this._isPinned ? "icon-wrong" : "icon-pushpin";

    return html`
      <uui-button
        @click=${this.#onClick}
        look="outline"
        color="default"
        label=${label}
        compact=""
        class="cork-workspace-button"
      >
        <uui-icon name=${icon}></uui-icon>
        <span>${label}</span>
      </uui-button>
    `;
  }
}
