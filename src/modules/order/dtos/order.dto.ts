import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { OrderEntity } from '../order.entity';

export enum OrderStatus {
  UNPAID = 'UNPAID', // Order is created, buyer has not paid yet.
  READY_TO_SHIP = 'READY_TO_SHIP', // Seller can arrange shipment.
  PROCESSED = 'PROCESSED', // Seller has arranged shipment online and got tracking number from 3PL.
  RETRY_SHIP = 'RETRY_SHIP', // 3PL pickup parcel fail. Need to re arrange shipment.
  SHIPPED = 'SHIPPED', // The parcel has been drop to 3PL or picked up by 3PL.
  TO_CONFIRM_RECEIVE = 'TO_CONFIRM_RECEIVE', // The order has been received by buyer.
  COMPLETED = 'COMPLETED', // :The order has been completed.
  IN_CANCEL = 'IN_CANCEL', //The order's cancelation is under processing.
  CANCELLED = 'CANCELLED', // he order has been canceled.
  TO_RETURN = 'TO_RETURN', // The buyer requested to return the order and order's return is processing.
  INVOICE_PENDING = 'INVOICE_PENDING',
}
export class OrderDto extends AbstractDto {
  constructor(entityName: OrderEntity) {
    super(entityName);
  }
}
