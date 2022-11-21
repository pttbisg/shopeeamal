import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { QueryOptionsDto } from '../../common/dto/query-options.dto';
import { RoleType } from '../../constants';
import { Auth } from '../../decorators/http.decorators';
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
@ApiTags('product', 'shopee')
@Auth(true, [RoleType.USER, RoleType.ADMIN])
export class ProductController {
  constructor(private productService: ProductService) {}

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
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOkResponse({
    type: UpdateStockResponseDto,
    description: 'Update the Stock of an Item',
  })
  @ApiBody({ type: UpdateStockPayloadDto })
  updateStock(
    @Query() options: QueryOptionsDto,
    @Body() payload: UpdateStockPayloadDto | Map<string, unknown>,
  ): Promise<UpdateStockResponseDto> {
    return this.productService.updateStock(
      options,
      payload as UpdateStockPayloadDto,
    );
  }
}
