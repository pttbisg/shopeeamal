import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { QueryOptionsDto } from '../../common/dto/query-options.dto';
import { RoleType } from '../../constants';
import { Auth } from '../../decorators/http.decorators';
import { ProxyService } from './proxy.service';

@Controller('proxy')
@ApiTags('proxy')
@Auth(true, [RoleType.USER, RoleType.ADMIN])
export class ProxyController {
  constructor(private proxyService: ProxyService) {}

  @Get('*')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description:
      'Proxy any request with query/params + json payload to this endpoint into Shopee API. ' +
      'Eg: `/proxy/...?q=val..` become `/api/v2/...?q=val` with the Oauth automatically handled. ' +
      'No validation or DB save, or queue mechanism enabled.',
  })
  proxyGet(@Req() req: Request, @Query() query: QueryOptionsDto) {
    return this.proxyService.proxy(req.method, req.path, query);
  }

  @Post('*')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description:
      'Proxy any request with query/params + json payload to this endpoint into Shopee API. ' +
      'Eg: `/proxy/...?q=val..` become `/api/v2/...?q=val` with the Oauth automatically handled. ' +
      'No validation or DB save, or queue mechanism enabled.',
  })
  @ApiBody({ type: Map<string, unknown> })
  proxyPost(
    @Req() req: Request,
    @Query() query: QueryOptionsDto,
    @Body() payload: Map<string, unknown>,
  ) {
    return this.proxyService.proxy(req.method, req.path, query, payload);
  }
}
