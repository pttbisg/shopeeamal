import type { PipeTransform } from '@nestjs/common';
import {
  applyDecorators,
  Param,
  ParseUUIDPipe,
  SetMetadata,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import type { Type } from '@nestjs/common/interfaces';
import {
  ApiForbiddenResponse,
  ApiSecurity,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import type { RoleType } from '../constants';
import { DOCS_AUTH_STRATEGY } from '../constants';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { AuthUserInterceptor } from '../interceptors/auth-user-interceptor.service';
import { PublicRoute } from './public-route.decorator';

export function Auth(
  roles: RoleType[] = [],
  options?: Partial<{ public: boolean }>,
): ClassDecorator & MethodDecorator {
  const isPublicRoute = options?.public;

  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthGuard, RolesGuard),
    ApiSecurity(DOCS_AUTH_STRATEGY),
    UseInterceptors(AuthUserInterceptor),
    ApiUnauthorizedResponse({
      description:
        'Unauthorized. Check the error message for the type (API/Shopee Oauth)',
    }),
    ApiForbiddenResponse({
      description:
        'Forbidden. Check the error message for the type (API/Shopee Oauth)',
    }),
    PublicRoute(isPublicRoute),
  );
}

export function Roles(
  roles: RoleType[] = [],
): ClassDecorator & MethodDecorator {
  return applyDecorators(SetMetadata('roles', roles));
}

export function UUIDParam(
  property: string,
  ...pipes: Array<Type<PipeTransform> | PipeTransform>
): ParameterDecorator {
  return Param(property, new ParseUUIDPipe({ version: '4' }), ...pipes);
}
