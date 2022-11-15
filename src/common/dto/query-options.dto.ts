import { StringField } from '../../decorators';

export class QueryOptionsDto {
  @StringField()
  readonly user_id: string;
}
