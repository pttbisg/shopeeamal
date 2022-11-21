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
  await queue.add(
    name,
    {
      ...message,
      user,
      query,
      payload,
    },
    {
      attempts: 14,
      backoff: {
        type: 'exponential',
        delay: 4000, // 4, 8, 16, 32, 1 min, 2 min, 4 min, 8 min, 16 min, 32 min, 1 hour, 2 hour, 4 hour, 8 hour
      },
    },
  );

  return message;
}
