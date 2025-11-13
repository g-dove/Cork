import { PinItemAction } from './pin-item.element.ts';

const manifest = {
  type: 'entityAction',
  alias: 'My.EntityAction',
  name: 'My Entity Action',
  weight: 10,
  api: PinItemAction,
  forEntityTypes: ['my-entity'],
  meta: {
    icon: 'icon-add',
    label: 'My Entity Action',
    repositoryAlias: 'My.Repository',
  },
};
