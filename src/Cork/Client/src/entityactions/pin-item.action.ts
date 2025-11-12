import { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UmbEntityActionBase } from '@umbraco-cms/backoffice/entity-action';
import type { UmbEntityActionArgs } from '@umbraco-cms/backoffice/entity-action';

export class PinItemAction extends UmbEntityActionBase<never> {
  constructor(host: UmbControllerHost, args: UmbEntityActionArgs<never>) {
    super(host, args);
  }

  override async execute() {
    if (!this.args.unique) throw new Error('Unique is not available');
		if (!this.args.entityType) throw new Error('Entity Type is not available');

    console.log(this.args);
  }
}

export { PinItemAction as api };
