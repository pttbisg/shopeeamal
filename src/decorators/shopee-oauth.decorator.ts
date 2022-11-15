import { UseGuards } from '@nestjs/common';

import { ShopeeOauthGuard } from '../guards/shopee-oauth.guard';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ShopeeOauth = () => UseGuards(ShopeeOauthGuard);
