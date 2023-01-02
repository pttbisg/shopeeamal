import { RoleType, UserEnvironment, UserStatus } from '../../../constants';
import {
  EnumFieldOptional,
  PositiveIntegerField,
  StringField,
  StringFieldOptional,
} from '../../../decorators';

export class UserRegisterDto {
  @StringFieldOptional()
  backendJWT: string;

  @StringField()
  readonly clientName: string;

  @PositiveIntegerField()
  partnerId: number;

  @StringFieldOptional()
  partnerKey: string;

  @EnumFieldOptional(() => RoleType)
  role: RoleType;

  @EnumFieldOptional(() => UserEnvironment)
  environment: UserEnvironment;

  @EnumFieldOptional(() => UserStatus)
  status: UserStatus;
}
