import { Column, Entity, Index } from 'typeorm';

import type { IAbstractEntity } from '../../common/abstract.entity';
import { AbstractEntity } from '../../common/abstract.entity';
import { DEFAULT_ROLE, RoleType, UserStatus } from '../../constants';
import { UseDto } from '../../decorators';
import { UserDto } from './dtos/user.dto';

export interface IUserEntity extends IAbstractEntity<UserDto> {
  clientName: string;

  apiKey: string;

  role: RoleType;
}

@Entity({ name: 'users' })
@UseDto(UserDto)
export class UserEntity extends AbstractEntity<UserDto> implements IUserEntity {
  @Column({ unique: true, nullable: false })
  clientName: string;

  @Index()
  @Column({ unique: true, nullable: false })
  apiKey: string;

  @Column({ type: 'enum', enum: RoleType, default: DEFAULT_ROLE })
  role: RoleType;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;
}
