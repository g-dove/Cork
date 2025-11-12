import { manifests as entrypoints } from "./entrypoints/manifest.js";
import { manifests as dashboards } from "./dashboards/manifest.js";
import { manifests as sidebars } from "./sidebars/manifest.js";
import { manifests as menus } from "./menus/manifest.js";
import { manifests as menuitems } from "./menuitems/manifest.js";
import { manifests as entityactions } from "./entityactions/manifest.js";

// Job of the bundle is to collate all the manifests from different parts of the extension and load other manifests
// We load this bundle from umbraco-package.json
export const manifests: Array<UmbExtensionManifest> = [
  ...entrypoints,
  ...dashboards,
  ...sidebars,
  ...menus,
  ...menuitems,
  ...entityactions,
];
