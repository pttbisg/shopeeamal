import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../constants';
import { Auth } from '../../decorators/http.decorators';
import { LocationsService } from './locations.service';

@Controller('shopee/locations')
@ApiTags('locations')
@Auth(true, [RoleType.ADMIN, RoleType.USER])
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get()
  getLocations(): Promise<unknown> {
    return this.locationsService.getLocations();
  }
}
