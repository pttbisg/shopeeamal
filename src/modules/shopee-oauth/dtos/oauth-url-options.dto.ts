import { QueryOptionsDto } from '../../../common/dto/query-options.dto';
import { BooleanFieldOptional, StringFieldOptional } from '../../../decorators';

export class OauthUrlOptionsDto extends QueryOptionsDto {
  @StringFieldOptional({
    description:
      'URL to redirect after user successfully signed in, default to the main page',
  })
  redirect: string;

  @BooleanFieldOptional({
    description:
      'If true, calling this API will redirect to login page. If false, return the URL instead',
    default: false,
  })
  should_redirect: boolean;
}
