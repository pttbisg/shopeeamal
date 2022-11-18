import {
  NumberFieldOptional,
  PositiveIntegerField,
  StringField,
} from '../../decorators';

export class ShopeeOptionsDto {
  @StringField()
  readonly partner_id: string;

  @StringField()
  readonly access_token: string;

  @PositiveIntegerField()
  readonly timestamp: string;

  @StringField()
  readonly sign: string;

  @NumberFieldOptional()
  readonly shop_id?: number;
}
