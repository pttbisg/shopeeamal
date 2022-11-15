import { ForbiddenException, UnauthorizedException } from '@nestjs/common';

export class ShopeeOauthUnathorizedException extends UnauthorizedException {
  name: 'ShopeeOauthUnathorizedException';

  constructor(error?: string) {
    super('error.shopeeOauthUnathorizedException', error);
  }
}
export class ShopeeOauthForbiddenException extends ForbiddenException {
  name: 'ShopeeOauthForbiddenException';

  constructor(error?: string) {
    super('error.shopeeOauthUnathorizedException', error);
  }
}
