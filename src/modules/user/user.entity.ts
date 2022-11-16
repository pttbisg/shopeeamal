import { Column, Entity, Index } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import {
  DEFAULT_ROLE,
  RoleType,
  UserEnvironment,
  UserLocation,
  UserStatus,
} from '../../constants';
import { UseDto } from '../../decorators';
import { UserDto } from './dtos/user.dto';

@Entity({ name: 'users' })
@UseDto(UserDto)
export class UserEntity extends AbstractEntity<UserDto> {
  @Column({ unique: true, nullable: false })
  clientName: string;

  @Index()
  @Column({ unique: true, nullable: false })
  apiKey: string;

  @Column({ type: 'enum', enum: RoleType, default: DEFAULT_ROLE })
  role: RoleType;

  @Column({ nullable: false })
  partnerId: string;

  @Column({ nullable: false })
  partnerKey: string;

  @Column({
    type: 'enum',
    enum: UserEnvironment,
    default: UserEnvironment.TEST,
  })
  environment: UserEnvironment;

  @Column({
    type: 'enum',
    enum: UserLocation,
    default: UserLocation.Singapore,
  })
  location: UserLocation;

  @Index()
  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;
}
