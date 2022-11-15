import { StringField } from '../../../decorators';

export class UrlDto {
  @StringField()
  url: string;
}
