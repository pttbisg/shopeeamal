export enum LogisticsStatus {
  LOGISTICS_NOT_STARTED = 'LOGISTICS_NOT_STARTED', //Initial status, order not ready for fulfillment
  LOGISTICS_REQUEST_CREATED = 'LOGISTICS_REQUEST_CREATED', //order arranged shipment
  LOGISTICS_PICKUP_DONE = 'LOGISTICS_PICKUP_DONE', //order handed over to 3PL
  LOGISTICS_PICKUP_RETRY = 'LOGISTICS_PICKUP_RETRY', //order pending 3PL retry pickup
  //order cancelled by 3PL due to failed pickup or picked up but not able to proceed with delivery
  LOGISTICS_PICKUP_FAILED = 'LOGISTICS_PICKUP_FAILED',
  LOGISTICS_DELIVERY_DONE = 'LOGISTICS_DELIVERY_DONE', //order successfully delivered
  LOGISTICS_DELIVERY_FAILED = 'LOGISTICS_DELIVERY_FAILED', //order cancelled due to 3PL delivery failed
  LOGISTICS_REQUEST_CANCELED = 'LOGISTICS_REQUEST_CANCELED', //order cancelled when order at LOGISTICS_REQUEST_CREATED
  LOGISTICS_COD_REJECTED = 'LOGISTICS_COD_REJECTED', //Integrated logistics COD: Order rejected for COD.
  LOGISTICS_READY = 'LOGISTICS_READY', //order ready for fulfilment from payment perspective:non-COD: order paidCOD: order passed COD screening
  LOGISTICS_INVALID = 'LOGISTICS_INVALID', //order cancelled when order at LOGISTICS_READY
  LOGISTICS_LOST = 'LOGISTICS_LOST', //order cancelled due to 3PL lost the order
  LOGISTICS_PENDING_ARRANGE = 'LOGISTICS_PENDING_ARRANGE', //order logistics pending arrangement
}
