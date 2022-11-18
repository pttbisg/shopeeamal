import type { CanActivate, PipeTransform, Type } from '@nestjs/common';
import {
  applyDecorators,
  Param,
  ParseUUIDPipe,
  SetMetadata,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiSecurity,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import type { RoleType } from '../constants';
import { DOCS_AUTH_STRATEGY } from '../constants';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { ShopeeOauthGuard } from '../guards/shopee-oauth.guard';
import { AuthUserInterceptor } from '../interceptors/auth-user-interceptor.service';
import { PublicRoute } from './public-route.decorator';

export function Auth(
  isShopeeAuthRequired = false,
  roles: RoleType[] = [],
  options?: Partial<{ public: boolean }>,
): ClassDecorator & MethodDecorator {
  const isPublicRoute = options?.public;
  const guards: Array<Type<CanActivate>> = [AuthGuard, RolesGuard];

  if (isShopeeAuthRequired) {
    guards.push(ShopeeOauthGuard);
  }

  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(...guards),
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
