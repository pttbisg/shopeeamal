import { EnumField, StringField } from '../../decorators';

export enum QueueStatus {
  PROCESSED = 'PROCESSED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}
export class QueueResponseDto {
  @StringField()
  queue_id: string;

  @EnumField(() => QueueStatus)
  status: QueueStatus;
}
