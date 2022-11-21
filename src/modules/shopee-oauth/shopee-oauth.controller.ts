import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiDefaultResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { QueryOptionsDto } from '../../common/dto/query-options.dto';
import { StandardErrorDto } from '../../common/dto/standard-error.dto';
import { RoleType } from '../../constants';
import { AuthUser, PublicRoute } from '../../decorators';
import { Auth } from '../../decorators/http.decorators';
import { UserEntity } from '../../modules/user/user.entity';
import { UserService } from '../../modules/user/user.service';
import {
  GetAccessTokenByResendCodePayloadDto,
  GetAccessTokenPayloadDto,
} from './dtos/get-access-token-payload.dto';
import { OauthCallbackQueryDto } from './dtos/oauth-callback.dto';
import { OauthUrlOptionsDto } from './dtos/oauth-url-options.dto';
import { ShopeeOauthResponseDto } from './dtos/shopee-oauth-response.dto';
import { UrlDto } from './dtos/url.dto';
import { ShopeeOauthService } from './shopee-oauth.service';

@Controller('shopee/auth')
@ApiTags('shopee-oauth')
@Auth(false, [RoleType.USER, RoleType.ADMIN])
@ApiDefaultResponse({
  type: StandardErrorDto,
})
export class ShopeeOauthController {
  constructor(
    private service: ShopeeOauthService,
    private userService: UserService,
  ) {}

  @Get('get_oauth_url')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: UrlDto,
    description: 'Get Shopee Oauth Login URL',
  })
  async initOauth(
    @AuthUser() user: UserEntity,
    @Query() options: OauthUrlOptionsDto,
    @Req() req,
    @Res() res,
  ) {
    const url = this.service.getOauthUrl(
      user,
      `${req.protocol}://${req.get('host')}`,
      options,
    );

    const status = await this.service.initializeOauth(user, options);

    if (options.should_redirect) {
      res.redirect(url);
    }

    const response = { url, oauth_status: status };

    res.status(HttpStatus.OK).json(response);
  }

  @Post(['token/get', 'get_access_token'])
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse({
    type: ShopeeOauthResponseDto,
    description: 'Get Access/Refresh Token',
  })
  getAccessToken(
    @AuthUser() user: UserEntity,
    @Query() query: QueryOptionsDto,
    @Body() payload: GetAccessTokenPayloadDto,
  ) {
    return this.service.getAccessToken(user, query, payload);
  }

  @Post('get_token_by_resend_code')
  @HttpCode(HttpStatus.ACCEPTED)
  getAccessTokenByResendCode(
    @AuthUser() user: UserEntity,
    @Query() query: QueryOptionsDto,
    @Body() payload: GetAccessTokenByResendCodePayloadDto,
  ) {
    return this.service.getAccessTokenByResendCode(user, query, payload);
  }

  @Post(['access_token/get', 'refresh_access_token'])
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse({
    type: ShopeeOauthResponseDto,
    description: 'Refresh Access Token',
  })
  refreshAccessToken(
    @AuthUser() user: UserEntity,
    @Query() query: QueryOptionsDto,
  ) {
    return this.service.refreshAccessToken(user, query);
  }

  @Get('callback')
  @HttpCode(HttpStatus.OK)
  @PublicRoute(true)
  async webhookCallback(@Query() query: OauthCallbackQueryDto, @Res() res) {
    const user = await this.userService.findOne({
      partnerId: query.partner_id,
    });

    if (!user) {
      throw new BadRequestException('partner_id is invalid');
    }

    await this.service.getAccessToken(
      user,
      {
        user_id: query.user_id,
        shop_id: query.shop_id,
      },
      {
        code: query.code,
        shop_id: Number(query.shop_id),
        main_account_id: query.main_account_id,
      },
    );

    res.redirect(query.callback_url);
  }
}
