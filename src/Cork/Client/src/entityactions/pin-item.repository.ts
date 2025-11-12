import { UmbRepositoryBase } from '@umbraco-cms/backoffice/repository';
//import { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller-api';

export class PinItemRepository extends UmbRepositoryBase {
  

  async pinItem(unique: string): Promise<void> {
    console.log(`📌 Pinning item with key: ${unique}`);
  }
}
