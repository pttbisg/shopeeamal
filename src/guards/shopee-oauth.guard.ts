import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ShopeeService } from '../shared/services/shopee.service';

@Injectable()
export class ShopeeOauthGuard implements CanActivate {
  constructor(
    private shopeeService: ShopeeService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userId = request.query?.user_id;

    if (!userId) {
      return false;
    }

    const shopeeOauth = {
      userId,
      timestamp: Date.now(),
      partnerId: 'TODO',
      accessToken: 'TODO',
    };

    SetMetadata('shopeeOauth', shopeeOauth);

    return true;
  }
}
