import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import _ from 'lodash';

import type { RoleType } from '../constants';
import { PUBLIC_ROUTE_KEY } from '../decorators';
import type { UserEntity } from '../modules/user/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const shouldAllowUnauthorizedRequest = this.reflector.get<boolean>(
      PUBLIC_ROUTE_KEY,
      context.getHandler(),
    );

    if (shouldAllowUnauthorizedRequest) {
      return true;
    }

    const roles = this.reflector.getAllAndMerge<RoleType[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (_.isEmpty(roles)) {
      return false; // disable all access to undefined role
    }

    const role = (<UserEntity>context.switchToHttp().getRequest().user).role;

    return _.includes(roles, role);
  }
}
