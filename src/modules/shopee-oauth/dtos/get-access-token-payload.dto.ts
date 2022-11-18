import { PositiveIntegerFieldOptional, StringField } from '../../../decorators';
export class GetAccessTokenPayloadDto {
  @StringField()
  code: string;

  @PositiveIntegerFieldOptional()
  shop_id?: number;

  @PositiveIntegerFieldOptional()
  main_account_id?: number;
}
export class GetAccessTokenByResendCodePayloadDto {
  @StringField()
  resend_code: string;
}
