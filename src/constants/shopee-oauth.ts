export enum ShopeeOauthStatus {
  CREATED = 'CREATED',
  INITIALIZED = 'INITIALIZED', // User initialize the login process
  AUTHORIZED = 'AUTHORIZED', // User grant authorization and we receive the code, but no access/refresh token yet
  ACTIVE = 'ACTIVE', // We have valid access token
  INACTIVE = 'INACTIVE', // We don't have valid access token, but we still have valid refresh token
  EXPIRED = 'EXPIRED', // Refresh token already expired
  REVOKED = 'REVOKED', // User/we revoke the access
  FAILED = 'FAILED',
}
