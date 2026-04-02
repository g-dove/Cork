const i = [
  {
    name: "Cork Entrypoint",
    alias: "Cork.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint-D09Tm1TN.js")
  }
], t = [
  {
    name: "Cork Sidebar App",
    alias: "Cork.Sidebar.App",
    type: "sectionSidebarApp",
    kind: "menuWithEntityActions",
    meta: {
      menu: "Cork.Menu"
    },
    element: () => import("./sidebar.element-BUuE69OL.js"),
    weight: 500,
    conditions: [
      {
        alias: "Umb.Condition.SectionAlias",
        match: "Umb.Section.Content"
      }
    ]
  }
], o = [
  {
    name: "Cork Sidebar Menu",
    alias: "Cork.Menu",
    type: "menu",
    meta: {
      label: "Favourites"
    }
  }
], n = [
  {
    name: "Cork Menu Item",
    alias: "Cork.Menu.Item",
    type: "menuItem",
    element: () => import("./pins.element-lJavsjd7.js"),
    meta: {
      label: "Favourites",
      icon: "icon-pin",
      entityType: "",
      menus: [
        "Cork.Menu"
      ]
    }
  }
], e = [
  {
    name: "Cork Favourite Entity Action",
    alias: "Cork.EntityAction.Favourite",
    type: "entityAction",
    kind: "default",
    weight: 10,
    api: () => import("./entityaction-D8oaJ4nN.js"),
    forEntityTypes: ["document"],
    meta: {
      label: "Favourite",
      icon: "icon-pushpin"
    },
    conditions: [
      {
        alias: "Umb.Condition.EntityIsNotTrashed"
      },
      {
        alias: "Cork.Condition.IsNotFavourited"
      }
    ]
  },
  {
    name: "Cork Unfavourite Entity Action",
    alias: "Cork.EntityAction.Unfavourite",
    type: "entityAction",
    kind: "default",
    weight: 10,
    api: () => import("./unfavourite-entityaction-DacQ2opT.js"),
    forEntityTypes: ["document"],
    meta: {
      label: "Unfavourite",
      icon: "icon-pushpin"
    },
    conditions: [
      {
        alias: "Umb.Condition.EntityIsNotTrashed"
      },
      {
        alias: "Cork.Condition.IsFavourited"
      }
    ]
  }
], a = "Cork.Condition.HasFavourites", s = "Cork.Condition.IsFavourited", r = "Cork.Condition.IsNotFavourited", m = [
  {
    name: "Cork Has Favourites Condition",
    alias: a,
    type: "condition",
    api: () => import("./has-favourites.condition-Jw3ov3l5.js")
  },
  {
    name: "Cork Is Favourited Condition",
    alias: s,
    type: "condition",
    api: () => import("./is-favourited.condition-0ty6wB-Q.js")
  },
  {
    name: "Cork Is Not Favourited Condition",
    alias: r,
    type: "condition",
    api: () => import("./is-not-favourited.condition-D5WRlaNP.js")
  }
], c = [
  {
    type: "workspaceAction",
    alias: "Cork.WorkspaceAction.Pin",
    name: "Cork Pin Workspace Action",
    api: () => import("./workspaceaction.action-B5Prj3Fn.js"),
    element: () => import("./workspaceaction.element-Ds1GyM1v.js"),
    weight: 100,
    conditions: [
      {
        alias: "Umb.Condition.WorkspaceAlias",
        match: "Umb.Workspace.Document"
      },
      {
        alias: "Umb.Condition.EntityIsNotTrashed"
      }
    ]
  }
], p = [
  ...i,
  ...t,
  ...o,
  ...n,
  ...e,
  ...m,
  ...c
];
export {
  p as manifests
};
//# sourceMappingURL=Cork.js.map
