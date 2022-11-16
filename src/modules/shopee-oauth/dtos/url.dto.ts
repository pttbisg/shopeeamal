import { ShopeeOauthStatus } from '../../../constants';
import { EnumFieldOptional, StringField } from '../../../decorators';

export class UrlDto {
  @StringField()
  url: string;

  @EnumFieldOptional(() => ShopeeOauthStatus)
  oauth_status: ShopeeOauthStatus;
}
