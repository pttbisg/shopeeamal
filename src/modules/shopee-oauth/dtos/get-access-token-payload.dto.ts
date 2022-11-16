import { StringField } from '../../../decorators';

export { OauthCallbackPayloadDto as GetAccessTokenPayloadDto } from './oauth-callback.dto';

export class GetAccessTokenByResendCodePayloadDto {
  @StringField()
  resend_code: string;
}
