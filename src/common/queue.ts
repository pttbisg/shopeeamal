import type { Queue } from 'bull';
import { v4 as uuid } from 'uuid';

import type { UserEntity } from '../modules/user/user.entity';
import { QueueStatus } from './dto/queue-response.dto';

export async function sendQueue(
  queue: Queue,
  name: string,
  user: UserEntity,
  query?,
  payload?,
) {
  const message = {
    queue_id: uuid(),
    status: QueueStatus.PROCESSED,
  };
  await queue.add(name, {
    ...message,
    user,
    query,
    payload,
  });

  return message;
}
