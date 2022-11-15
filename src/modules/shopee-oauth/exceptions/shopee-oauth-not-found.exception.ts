import { NotFoundException } from '@nestjs/common';

export class ShopeeOauthNotFoundException extends NotFoundException {
  constructor(error?: string) {
    super('error.shopeeOauthNotFound', error);
  }
}
