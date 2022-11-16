import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

import { ShopeeResponseDto } from '../../../common/dto/shopee-response.dto';
import { NumberField, StringField } from '../../../decorators';
import type { ShopeeOauthDto } from './shopee-oauth.dto';

class RawShopeeOauthResponseDto extends ShopeeResponseDto {
  @StringField()
  refresh_token: string;

  @StringField()
  access_token: string;

  @NumberField()
  @IsInt()
  expire_in: number;

  @ApiPropertyOptional()
  shop_id_list: string[];

  @ApiPropertyOptional()
  merchant_id_list: string[];
}

export class ShopeeOauthResponseDto extends RawShopeeOauthResponseDto {
  shopee_oauth: ShopeeOauthDto;
}
