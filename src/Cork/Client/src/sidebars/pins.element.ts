import {
  LitElement,
  css,
  html,
  customElement,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { UMB_ACTION_EVENT_CONTEXT } from "@umbraco-cms/backoffice/action";
import { UmbRequestReloadStructureForEntityEvent } from "@umbraco-cms/backoffice/entity-action";
import { UMB_NOTIFICATION_CONTEXT } from "@umbraco-cms/backoffice/notification";
import { client } from "../api/client.gen.js";

interface FavouriteItem {
  nodeKey: string;
  nodeName: string;
  published: boolean;
}

@customElement("cork-pins")
export class Pins extends UmbElementMixin(LitElement) {
  @state()
  private _favourites: FavouriteItem[] = [];

  @state()
  private _loading = true;

  @state()
  private _dragIndex: number | null = null;

  @state()
  private _dragOverIndex: number | null = null;

  private _boundRefresh = () => this._loadFavourites();

  private _actionEventContext?: typeof UMB_ACTION_EVENT_CONTEXT.TYPE;
  private _notificationContext?: typeof UMB_NOTIFICATION_CONTEXT.TYPE;

  connectedCallback() {
    super.connectedCallback();
    this._loadFavourites();
    window.addEventListener("cork-favourites-updated", this._boundRefresh);

    this.consumeContext(UMB_ACTION_EVENT_CONTEXT, (ctx) => {
      this._actionEventContext = ctx;
      if (ctx) {
        ctx.addEventListener(
          UmbRequestReloadStructureForEntityEvent.TYPE,
          this._boundRefresh,
        );
      }
    });

    this.consumeContext(UMB_NOTIFICATION_CONTEXT, (ctx) => {
      this._notificationContext = ctx;
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("cork-favourites-updated", this._boundRefresh);
    this._actionEventContext?.removeEventListener(
      UmbRequestReloadStructureForEntityEvent.TYPE,
      this._boundRefresh,
    );
  }

  private async _loadFavourites() {
    this._loading = true;
    const { data, error } = await client.get({
      url: "/umbraco/cork/api/v1/favourites",
      query: { contentType: 'content' },
      security: [{ scheme: "bearer", type: "http" }],
    });

    if (!error && data) {
      this._favourites = data as FavouriteItem[];
    }
    this._loading = false;
  }

  private _navigateToNode(nodeKey: string) {
    window.history.pushState(
      {},
      "",
      `/umbraco/section/content/workspace/document/edit/${nodeKey}`
    );
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  private async _removeFavourite(e: Event, nodeKey: string) {
    e.stopPropagation();
    const { error } = await client.delete({
      url: "/umbraco/cork/api/v1/favourites/{nodeKey}",
      path: { nodeKey },
      security: [{ scheme: "bearer", type: "http" }],
    });

    if (!error) {
      this._notificationContext?.peek("positive", {
        data: { headline: "Removed from favourites", message: "" },
      });
    } else {
      this._notificationContext?.peek("danger", {
        data: { headline: "Failed to remove favourite", message: "" },
      });
    }

    this._loadFavourites();
    window.dispatchEvent(new CustomEvent("cork-favourites-updated"));
  }

  private _onDragStart(index: number, e: DragEvent) {
    this._dragIndex = index;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
    }
  }

  private _onDragOver(index: number, e: DragEvent) {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "move";
    }
    this._dragOverIndex = index;
  }

  private _onDragEnd() {
    if (this._dragIndex !== null && this._dragOverIndex !== null && this._dragIndex !== this._dragOverIndex) {
      const reordered = [...this._favourites];
      const [moved] = reordered.splice(this._dragIndex, 1);
      reordered.splice(this._dragOverIndex, 0, moved);
      this._favourites = reordered;
      this._saveSortOrder();
    }
    this._dragIndex = null;
    this._dragOverIndex = null;
  }

  private async _saveSortOrder() {
    await client.put({
      url: "/umbraco/cork/api/v1/favourites/sort",
      body: { nodeKeys: this._favourites.map((f) => f.nodeKey) },
      security: [{ scheme: "bearer", type: "http" }],
    });
  }

  render() {
    if (this._loading) {
      return html``;
    }
    
    if (this._favourites.length === 0) {
      return html`<uui-menu-item label="No favourites pinned" disabled></uui-menu-item>`;
    }

    return html`
      ${this._favourites.map(
        (fav, index) => html`
          <div
            class="sortable-item ${this._dragOverIndex === index ? "drag-over" : ""}"
            draggable="true"
            @dragstart=${(e: DragEvent) => this._onDragStart(index, e)}
            @dragover=${(e: DragEvent) => this._onDragOver(index, e)}
            @dragend=${() => this._onDragEnd()}
          >
            <uui-menu-item
              label=${fav.nodeName}
              @click-label=${() => this._navigateToNode(fav.nodeKey)}
              class=${fav.published ? "" : "draft"}
            >
              <uui-icon slot="icon" name="icon-document"></uui-icon>
              <uui-action-bar slot="actions">
                <uui-button
                  label="Remove"
                  @click=${(e: Event) => this._removeFavourite(e, fav.nodeKey)}
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

  static styles = [
    css`
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
    `,
  ];
}

export default Pins;

declare global {
  interface HTMLElementTagNameMap {
    "cork-pins": Pins;
  }
}
