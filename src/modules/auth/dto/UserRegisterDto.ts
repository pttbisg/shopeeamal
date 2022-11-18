import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { RoleType, UserEnvironment, UserStatus } from '../../../constants';
import { EnumFieldOptional, PositiveIntegerField } from '../../../decorators';
import { Trim } from '../../../decorators/transform.decorators';

export class UserRegisterDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  readonly clientName: string;

  @PositiveIntegerField()
  @Trim()
  partnerId: number;

  @ApiPropertyOptional()
  @IsString()
  @Trim()
  partnerKey: string;

  @ApiPropertyOptional()
  @EnumFieldOptional(() => RoleType)
  role: RoleType;

  @ApiPropertyOptional()
  @EnumFieldOptional(() => UserEnvironment)
  environment: UserEnvironment;

  @ApiPropertyOptional()
  @EnumFieldOptional(() => UserStatus)
  status: UserStatus;
}
