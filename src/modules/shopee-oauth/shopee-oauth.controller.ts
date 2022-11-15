import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../constants';
import { Auth, AuthUser } from '../../decorators';
import { UserEntity } from '../../modules/user/user.entity';
import { OauthUrlOptionsDto } from './dtos/oauth-url-options.dto';
import { ShopeeOauthDto } from './dtos/shopee-oauth.dto';
import { UrlDto } from './dtos/url.dto';
import { ShopeeOauthService } from './shopee-oauth.service';

@Controller('shopee/auth')
@ApiTags('shopee-oauth', 'shopee')
@Auth([RoleType.USER, RoleType.ADMIN])
export class ShopeeOauthController {
  constructor(private service: ShopeeOauthService) {}

  @Get('/auth/get_oauth_url')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: UrlDto,
    description: 'Get Shopee Oauth Login URL',
  })
  initOauth(
    @AuthUser() user: UserEntity,
    @Query() getOauthUrlOption: OauthUrlOptionsDto,
    @Res() res,
  ): UrlDto {
    const url = this.service.getOauthUrl(getOauthUrlOption, user);

    if (getOauthUrlOption.should_redirect) {
      return res.redirect(url);
    }

    return res.json(200, { url });
  }

  @Post('/auth/token/get')
  @HttpCode(HttpStatus.CREATED)
  getAccessToken(@Body() createShopeeOauthDto: ShopeeOauthDto) {
    // const entity = await this.shopeeOauthService.getAccessToken(
    //   createShopeeOauthDto,
    // );
    // return entity.toDto();
    return createShopeeOauthDto;
  }

  @Post('/auth/access_token/get')
  @HttpCode(HttpStatus.CREATED)
  refreshAccessToken(@Body() createShopeeOauthDto: ShopeeOauthDto) {
    // const entity = await this.shopeeOauthService.refreshAcessToken(
    //   createShopeeOauthDto,
    // );
    // return entity.toDto();
    return createShopeeOauthDto;
  }
}
