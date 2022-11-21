import { ObjectResponse } from '../../../common/dto/shopee-object.dto';
import {
  EnumFieldOptional,
  StringField,
  StringFieldOptional,
} from '../../../decorators';

export enum DocumentStatus {
  READY = 'READY',
  FAILED = 'FAILED',
  PROCESSING = 'PROCESSING',
}

export class ShippingDocumentResult extends ObjectResponse {
  @StringField()
  order_sn: string;

  @StringFieldOptional()
  package_number?: string;

  @EnumFieldOptional(() => DocumentStatus)
  status?: DocumentStatus | string;

  @StringFieldOptional()
  fail_error?: string;

  @StringFieldOptional()
  fail_message?: string;
}
