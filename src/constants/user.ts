export enum RoleType {
  USER = 'USER',
  ADMIN = 'ADMIN',
}
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum UserEnvironment {
  LIVE = 'LIVE',
  SANDBOX = 'SANDBOX',
  TEST = 'TEST',
}

export const DEFAULT_ROLE = RoleType.USER;

export { Country as UserLocation } from './country';
