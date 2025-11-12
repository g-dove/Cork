const n = [
  {
    name: "Cork Entrypoint",
    alias: "Cork.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint-CkOuTyHN.js")
  }
], t = [
  {
    name: "Cork Dashboard",
    alias: "Cork.Dashboard",
    type: "dashboard",
    js: () => import("./dashboard.element-CrG1ZR8b.js"),
    meta: {
      label: "Example Dashboard",
      pathname: "example-dashboard"
    },
    conditions: [
      {
        alias: "Umb.Condition.SectionAlias",
        match: "Umb.Section.Content"
      }
    ]
  }
], e = [
  {
    name: "cork",
    alias: "cork.sidebar.app",
    type: "sectionSidebarApp",
    kind: "menu",
    meta: {
      label: "Pins",
      menu: "cork.menu"
    },
    weight: 999999,
    conditions: [
      {
        alias: "Umb.Condition.SectionAlias",
        match: "Umb.Section.Content"
      }
    ]
  }
], i = [
  {
    type: "menu",
    alias: "cork.menu",
    name: "cork sidebar menu",
    meta: {
      label: "Pins"
    }
  }
], a = [
  {
    type: "menuItem",
    alias: "cork.menu.item",
    name: "cork pin item",
    meta: {
      label: "Pin",
      icon: "icon-pin",
      entityType: "",
      menus: [
        "cork.menu"
      ]
    }
  }
], o = [
  {
    type: "entityAction",
    kind: "default",
    alias: "Cork.PinItemAction",
    name: "Cork Pin Action",
    weight: 0,
    api: () => import("./pin-item.action-SAEaROoM.js"),
    forEntityTypes: ["document"],
    meta: {
      icon: "icon-pushpin",
      label: "Pin this page"
    }
  }
], s = [
  ...n,
  ...t,
  ...e,
  ...i,
  ...a,
  ...o
];
export {
  s as manifests
};
//# sourceMappingURL=cork.js.map
