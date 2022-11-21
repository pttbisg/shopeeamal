import { InjectQueue } from '@nestjs/bull';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiBody,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Queue } from 'bull';

import { AsyncQueryOptionsDto } from '../../common/dto/query-options.dto';
import { QueueResponseDto } from '../../common/dto/queue-response.dto';
import { sendQueue } from '../../common/queue';
import { RoleType } from '../../constants';
import { AuthUser } from '../../decorators';
import { Auth } from '../../decorators/http.decorators';
import { UserEntity } from '../../modules/user/user.entity';
import { ItemBaseInfoOptionsDto } from './dtos/item-base-info-options.dto';
import { ItemBaseInfoResponseDto } from './dtos/item-base-info-response.dto';
import { ItemListOptionsDto } from './dtos/item-list-options.dto';
import { ItemListResponseDto } from './dtos/item-list-response.dto';
import { ModelListOptionsDto } from './dtos/model-list-options.dto';
import { ModelListResponseDto } from './dtos/model-list-response.dto';
import { UpdateStockPayloadDto } from './dtos/update-stock-payload.dto';
import { UpdateStockResponseDto } from './dtos/update-stock-response.dto';
import { ProductService } from './product.service';

@Controller('shopee/product')
@ApiTags('product', 'sku')
@Auth(true, [RoleType.USER, RoleType.ADMIN])
export class ProductController {
  constructor(
    private productService: ProductService,
    @InjectQueue('product') private queue: Queue,
  ) {}

  @Get('get_item_list')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: ItemListResponseDto,
    description: 'Get List of Shopee Item',
  })
  getitemList(
    @Query() options: ItemListOptionsDto,
  ): Promise<ItemListResponseDto> {
    return this.productService.getItemList(options);
  }

  @Get('get_item_base_info')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: ItemBaseInfoResponseDto,
    description: 'Get Detail of Shopee Item',
  })
  getItemBaseInfo(
    @Query() options: ItemBaseInfoOptionsDto,
  ): Promise<ItemBaseInfoResponseDto> {
    return this.productService.getItemBaseInfo(options);
  }

  @Get('get_model_list')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: ModelListResponseDto,
    description: 'Get List of Shopee Item Models',
  })
  getModelList(
    @Query() options: ModelListOptionsDto,
  ): Promise<ModelListResponseDto> {
    return this.productService.getModelList(options);
  }

  @Post('update_stock')
  @ApiTags('inventory')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOkResponse({
    type: UpdateStockResponseDto,
    description: 'Update the Stock of an Item',
  })
  @ApiAcceptedResponse({
    type: QueueResponseDto,
    description: 'Update the Stock of an Item asynchronously',
  })
  @ApiBody({ type: UpdateStockPayloadDto })
  updateStock(
    @AuthUser() user: UserEntity,
    @Query() options: AsyncQueryOptionsDto,
    @Body() payload: UpdateStockPayloadDto | Map<string, unknown>,
  ): Promise<UpdateStockResponseDto | QueueResponseDto> {
    if (options.is_async === true) {
      return sendQueue(this.queue, 'update_stock', user, options, payload);
    }

    return this.productService.updateStock(
      options,
      payload as UpdateStockPayloadDto,
    );
  }
}
