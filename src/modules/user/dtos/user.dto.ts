import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { UserStatus } from '../../../constants';
import type { UserEntity } from '../user.entity';
export class UserDto extends AbstractDto {
  @ApiProperty()
  clientName: string;

  @ApiPropertyOptional()
  apiKey: string;

  @ApiProperty()
  status: UserStatus;

  constructor(user: UserEntity) {
    super(user);
    this.clientName = user.clientName;
    this.apiKey = user.apiKey;
    this.status = user.status;
  }
}
