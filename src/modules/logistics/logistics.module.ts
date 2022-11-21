import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { QueueName } from '../../constants/queue';
import { LogisticsController } from './logistics.controller';
import { LogisticsProcessor } from './logistics.processor';
import { LogisticsService } from './logistics.service';

export const handlers = [];

@Module({
  imports: [
    BullModule.registerQueue({
      name: QueueName.logistics,
    }),
  ],
  providers: [LogisticsService, LogisticsProcessor, ...handlers],
  controllers: [LogisticsController],
})
export class LogisticsModule {}
