import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { ShopeeOauthEntity } from '../shopee-oauth.entity';

export class ShopeeOauthDto extends AbstractDto {
  constructor(entityName: ShopeeOauthEntity) {
    super(entityName);
  }
}
