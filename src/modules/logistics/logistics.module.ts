import { Module } from '@nestjs/common';

import { LogisticsController } from './logistics.controller';
import { LogisticsService } from './logistics.service';

export const handlers = [];

@Module({
  imports: [],
  providers: [LogisticsService, ...handlers],
  controllers: [LogisticsController],
})
export class LogisticsModule {}
