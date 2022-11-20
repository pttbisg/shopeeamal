import {
  EnumField,
  StringFieldOptional,
  TimestampField,
} from '../../../decorators';

enum TrackingLogisticsStatus {
  INITIAL = 'INITIAL',
  ORDER_INIT = 'ORDER_INIT',
  ORDER_SUBMITTED = 'ORDER_SUBMITTED',
  ORDER_FINALIZED = 'ORDER_FINALIZED',
  ORDER_CREATED = 'ORDER_CREATED',
  PICKUP_REQUESTED = 'PICKUP_REQUESTED',
  PICKUP_PENDING = 'PICKUP_PENDING',
  PICKED_UP = 'PICKED_UP',
  DELIVERY_PENDING = 'DELIVERY_PENDING',
  DELIVERED = 'DELIVERED',
  PICKUP_RETRY = 'PICKUP_RETRY',
  TIMEOUT = 'TIMEOUT',
  LOST = 'LOST',
  UPDATE = 'UPDATE',
  UPDATE_SUBMITTED = 'UPDATE_SUBMITTED',
  UPDATE_CREATED = 'UPDATE_CREATED',
  RETURN_STARTED = 'RETURN_STARTED',
  RETURNED = 'RETURNED',
  RETURN_PENDING = 'RETURN_PENDING',
  RETURN_INITIATED = 'RETURN_INITIATED',
  EXPIRED = 'EXPIRED',
  CANCEL = 'CANCEL',
  CANCEL_CREATED = 'CANCEL_CREATED',
  CANCELED = 'CANCELED',
  FAILED_ORDER_INIT = 'FAILED_ORDER_INIT',
  FAILED_ORDER_SUBMITTED = 'FAILED_ORDER_SUBMITTED',
  FAILED_ORDER_CREATED = 'FAILED_ORDER_CREATED',
  FAILED_PICKUP_REQUESTED = 'FAILED_PICKUP_REQUESTED',
  FAILED_PICKED_UP = 'FAILED_PICKED_UP',
  FAILED_DELIVERED = 'FAILED_DELIVERED',
  FAILED_UPDATE_SUBMITTED = 'FAILED_UPDATE_SUBMITTED',
  FAILED_UPDATE_CREATED = 'FAILED_UPDATE_CREATED',
  FAILED_RETURN_STARTED = 'FAILED_RETURN_STARTED',
  FAILED_RETURNED = 'FAILED_RETURNED',
  FAILED_CANCEL_CREATED = 'FAILED_CANCEL_CREATED',
  FAILED_CANCELED = 'FAILED_CANCELED',
}

export class TrackingInfo {
  @TimestampField()
  update_time: number;

  @StringFieldOptional()
  description?: string;

  @EnumField(() => TrackingLogisticsStatus)
  logistics_status: TrackingLogisticsStatus | string;
}