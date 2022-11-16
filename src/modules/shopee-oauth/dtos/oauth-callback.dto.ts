import { NumberFieldOptional, StringField } from '../../../decorators';
import { OauthUrlOptionsDto } from './oauth-url-options.dto';

export class OauthCallbackOptionsDto extends OauthUrlOptionsDto {
  @StringField()
  partner_id: string;

  @StringField()
  redirect_url: string;
}

export class OauthCallbackPayloadDto {
  @StringField()
  code: string;

  @NumberFieldOptional()
  shop_id?: number;

  @NumberFieldOptional()
  main_account_id?: number;
}
