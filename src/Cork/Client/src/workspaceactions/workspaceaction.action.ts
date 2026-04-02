import { UmbWorkspaceActionBase, type UmbWorkspaceActionArgs } from '@umbraco-cms/backoffice/workspace';
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UMB_NOTIFICATION_CONTEXT } from "@umbraco-cms/backoffice/notification";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT } from "@umbraco-cms/backoffice/document";
import { client } from "../api/client.gen.js";

interface FavouriteItem {
  nodeKey: string;
  nodeName: string;
  published: boolean;
}

export default class CorkPinWorkspaceAction extends UmbWorkspaceActionBase<never> {
  #notificationContext?: typeof UMB_NOTIFICATION_CONTEXT.TYPE;
  #workspaceContext?: typeof UMB_DOCUMENT_WORKSPACE_CONTEXT.TYPE;

  constructor(host: UmbControllerHost, args: UmbWorkspaceActionArgs<never>) {
    super(host, args);

    this.consumeContext(UMB_NOTIFICATION_CONTEXT, (ctx) => {
      this.#notificationContext = ctx;
    });

    this.consumeContext(UMB_DOCUMENT_WORKSPACE_CONTEXT, (ctx) => {
      this.#workspaceContext = ctx;
    });
  }

  override async execute(): Promise<void> {
    const unique = this.#workspaceContext?.getUnique();
    
    // Ignore if it's an unsaved document or missing an ID
    if (!unique) {
      this.#notificationContext?.peek("warning", {
        data: { headline: "Save document first", message: "You cannot pin an unsaved document." },
      });
      return;
    }

    const { data, error: fetchError } = await client.get({
      url: "/umbraco/cork/api/v1/favourites",
      query: { contentType: 'content' },
      security: [{ scheme: "bearer", type: "http" }],
    });

    if (fetchError) {
      this.#notificationContext?.peek("danger", {
        data: { headline: "Failed to check pin status", message: "" },
      });
      return;
    }

    const favourites = (data as FavouriteItem[]) ?? [];
    const isPinned = favourites.some((f) => f.nodeKey === unique);

    if (isPinned) {
      const { error } = await client.delete({
        url: "/umbraco/cork/api/v1/favourites/{nodeKey}",
        path: { nodeKey: unique },
        security: [{ scheme: "bearer", type: "http" }],
      });

      if (!error) {
        this.#notificationContext?.peek("positive", {
          data: { headline: "Removed from favourites", message: "" },
        });
        window.dispatchEvent(new CustomEvent("cork-favourites-updated"));
      } else {
        this.#notificationContext?.peek("danger", {
          data: { headline: "Failed to unpin node", message: "" },
        });
      }
    } else {
      const { error } = await client.post({
        url: "/umbraco/cork/api/v1/favourites",
        body: { nodeKey: unique, contentType: 'content' },
        security: [{ scheme: "bearer", type: "http" }],
      });

      if (!error) {
        this.#notificationContext?.peek("positive", {
          data: { headline: "Added to favourites", message: "" },
        });
        window.dispatchEvent(new CustomEvent("cork-favourites-updated"));
      } else {
        this.#notificationContext?.peek("danger", {
          data: { headline: "Failed to pin node", message: "" },
        });
      }
    }
  }
}
