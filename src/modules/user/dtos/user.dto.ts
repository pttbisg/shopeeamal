import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import {
  RoleType,
  UserEnvironment,
  UserLocation,
  UserStatus,
} from '../../../constants';
import type { UserEntity } from '../user.entity';
export class UserDto extends AbstractDto {
  @ApiProperty()
  clientName: string;

  @ApiPropertyOptional()
  apiKey: string;

  @ApiProperty()
  partnerId: string;

  @ApiPropertyOptional()
  partnerKey: string;

  @ApiProperty()
  role: RoleType;

  @ApiPropertyOptional()
  environment: UserEnvironment;

  @ApiPropertyOptional()
  location: UserLocation;

  @ApiProperty()
  status: UserStatus;

  constructor(user: UserEntity) {
    super(user);
    this.clientName = user.clientName;
    this.apiKey = user.apiKey;
    this.partnerId = user.partnerId;
    this.partnerKey = user.partnerKey;
    this.role = user.role;
    this.environment = user.environment;
    this.location = user.location;
    this.status = user.status;
  }
}
