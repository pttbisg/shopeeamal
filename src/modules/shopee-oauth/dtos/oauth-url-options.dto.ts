import { QueryOptionsDto } from '../../../common/dto/query-options.dto';
import { BooleanFieldOptional, StringFieldOptional } from '../../../decorators';

export class OauthUrlOptionsDto extends QueryOptionsDto {
  @StringFieldOptional({
    description:
      'Final URL to redirect after user successfully signed in and this service process the callback. Default to the main page',
  })
  redirect_url?: string;

  @BooleanFieldOptional({
    description:
      'If true, calling this API will redirect to login page. If false, return the URL instead',
    default: false,
  })
  should_redirect?: boolean;
}
