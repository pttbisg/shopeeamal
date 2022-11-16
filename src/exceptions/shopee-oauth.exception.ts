import { ForbiddenException, UnauthorizedException } from '@nestjs/common';

export class ShopeeOauthUnathorizedException extends UnauthorizedException {
  constructor(objectOrError?, description?: string) {
    super(objectOrError, description);
  }
}
export class ShopeeOauthForbiddenException extends ForbiddenException {
  constructor(objectOrError?, description?: string) {
    super(objectOrError, description);
  }
}
