import { StringField, StringFieldOptional } from '../../decorators';

export class QueryOptionsDto {
  @StringField({
    description:
      'The id to represent the user that grant access to their Shopee data. Can be internal id or same as shop_id',
  })
  readonly user_id: string;

  @StringFieldOptional({
    description:
      'The shop_id to represent the id from Shopee side. Optional but recommended to identify the shop/user',
  })
  readonly shop_id?: string;
}
