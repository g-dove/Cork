export const manifests: Array<UmbExtensionManifest> = [
  {
    type: 'entityAction',
    kind: 'default',
    alias: 'Cork.PinItemAction',
    name: 'Cork Pin Action',
    weight: 0,
    api: () => import('./pin-item.action.ts'),
    forEntityTypes: ['document'],
    meta: {
      icon: 'icon-pushpin',
      label: 'Pin this page',
    }
  }
];