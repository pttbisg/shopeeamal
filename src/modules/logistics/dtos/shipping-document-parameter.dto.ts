import { ObjectResponse } from '../../../common/dto/shopee-object.dto';
import {
  EnumFieldOptional,
  StringEnumArrayQueryExplodeFieldOptional,
  StringField,
  StringFieldOptional,
} from '../../../decorators';

export enum ShippingDocumentType {
  NORMAL_AIR_WAYBILL = 'NORMAL_AIR_WAYBILL',
  THERMAL_AIR_WAYBILL = 'THERMAL_AIR_WAYBILL',
  NORMAL_JOB_AIR_WAYBILL = 'NORMAL_JOB_AIR_WAYBILL',
  THERMAL_JOB_AIR_WAYBILL = 'THERMAL_JOB_AIR_WAYBILL',
}

export class ShippingDocumentParameter extends ObjectResponse {
  @StringField()
  order_sn: string;

  @StringFieldOptional()
  package_number?: string;

  @EnumFieldOptional(() => ShippingDocumentType)
  suggest_shipping_document_type?: ShippingDocumentType | string;

  @StringEnumArrayQueryExplodeFieldOptional(() => ShippingDocumentType)
  selectable_shipping_document_type?: ShippingDocumentType[] | string[];

  @StringFieldOptional()
  fail_error?: string;

  @StringFieldOptional()
  fail_message?: string;
}
