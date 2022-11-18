import {
  PositiveIntegerField,
  PositiveIntegerFieldOptional,
  StringField,
} from '../../../decorators';
import { OauthUrlOptionsDto } from './oauth-url-options.dto';

export class OauthCallbackOptionsDto extends OauthUrlOptionsDto {
  @PositiveIntegerField()
  partner_id: number;

  @StringField()
  callback_url: string;
}

export class OauthCallbackQueryDto extends OauthCallbackOptionsDto {
  @StringField()
  code: string;

  @PositiveIntegerFieldOptional()
  shop_id?: number;

  @PositiveIntegerFieldOptional()
  main_account_id?: number;
}
