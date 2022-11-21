import { ApiProperty } from '@nestjs/swagger';

import { ObjectResponse } from '../../../common/dto/shopee-object.dto';
import {
  EnumField,
  ObjectResponseFieldOptional,
  StringField,
  StringFieldOptional,
} from '../../../decorators';

enum RecipientAddressKey {
  name = 'name',
  phone = 'phone',
  full_address = 'full_address',
  town = 'town',
  district = 'district',
  city = 'city',
  state = 'state',
  region = 'region',
  zipcode = 'zipcode',
}

class RecipientAddressInfo {
  @EnumField(() => RecipientAddressKey)
  key: RecipientAddressKey;

  @ObjectResponseFieldOptional()
  style: ObjectResponse;
}

export class ShippingDocumentPayloadDto extends ObjectResponse {
  @StringField()
  order_sn: string;

  @StringFieldOptional()
  package_number?: string;

  @ApiProperty({ type: RecipientAddressInfo, isArray: true })
  recipient_address_info: RecipientAddressInfo[];
}
