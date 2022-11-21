import {
  BooleanFieldOptional,
  PositiveIntegerFieldOptional,
  StringField,
} from '../../decorators';

export class QueryOptionsDto {
  @StringField({
    description:
      'The id to represent the user that grant access to their Shopee data. Can be internal id or same as shop_id',
  })
  readonly user_id: string;

  @PositiveIntegerFieldOptional({
    description:
      'The shop_id to represent the id from Shopee side. Optional but recommended to identify the shop/user',
    example: undefined, //force blank
  })
  readonly shop_id?: number;
}
export class AsyncQueryOptionsDto extends QueryOptionsDto {
  @BooleanFieldOptional({
    description:
      'Set true to make this method run asynchronously by queueing the command instead of calling Shopee API directly',
    default: false,
  })
  is_async? = false;
}
