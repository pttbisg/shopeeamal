import type { ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { IAuthGuard, Type } from '@nestjs/passport';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';

import { AUTH_STRATEGY } from '../constants';
import { PUBLIC_ROUTE_KEY } from '../decorators';

//DEPRECATED
export function GetAuthGuard(
  options?: Partial<{ public: boolean }>,
): Type<IAuthGuard> {
  const strategies = ['jwt'];

  if (options?.public) {
    strategies.push('public');
  }

  return NestAuthGuard(strategies);
}

@Injectable()
export class AuthGuard extends NestAuthGuard(AUTH_STRATEGY) {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const shouldAllowUnauthenticatedRequest = this.reflector.get<boolean>(
      PUBLIC_ROUTE_KEY,
      context.getHandler(),
    );

    if (shouldAllowUnauthenticatedRequest) {
      return true;
    }

    return super.canActivate(context);
  }
}
