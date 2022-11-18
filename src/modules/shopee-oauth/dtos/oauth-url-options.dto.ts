import { QueryOptionsDto } from '../../../common/dto/query-options.dto';
import { BooleanFieldOptional, StringFieldOptional } from '../../../decorators';

export class OauthUrlOptionsDto extends QueryOptionsDto {
  @StringFieldOptional({
    description:
      'Final/Callback URL to call/redirect after user successfully signed in and this service process the callback. ' +
      'Point this to frontend/backend URL with some query paramaters to get the notification if the login is successful. ' +
      'Default to the main page',
  })
  callback_url?: string;

  @BooleanFieldOptional({
    description:
      'If true, calling this API will redirect to login page. If false, return the URL instead and redirect it from client side.',
    default: false,
  })
  should_redirect?: boolean;
}
