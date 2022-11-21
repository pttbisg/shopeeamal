import { Module } from '@nestjs/common';

import { ProxyController } from './proxy.controller';
import { ProxyService } from './proxy.service';

export const handlers = [];

@Module({
  imports: [],
  providers: [ProxyService, ...handlers],
  controllers: [ProxyController],
})
export class ProxyModule {}
