import {
  PositiveIntegerFieldOptional,
  StringField,
  StringFieldOptional,
} from '../../../decorators';
import { OauthUrlOptionsDto } from './oauth-url-options.dto';

export class OauthCallbackOptionsDto extends OauthUrlOptionsDto {
  @StringField()
  partner_id: string;

  @StringField()
  callback_url: string;
}

export class OauthCallbackQueryDto extends OauthCallbackOptionsDto {
  @StringField()
  code: string;

  @StringFieldOptional()
  shop_id?: string;

  @PositiveIntegerFieldOptional()
  main_account_id?: number;
}
