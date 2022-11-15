import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';

import { AUTH_HEADER_KEY } from '../../../constants';
import { AuthService } from '../auth.service';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy) {
  private readonly logger = new Logger(ApiKeyStrategy.name);

  constructor(
    private readonly authService: AuthService, // private readonly shopeeService: ShopeeService,
  ) {
    super({ header: AUTH_HEADER_KEY }, false, async (apiKey: string, done) => {
      try {
        const user = await this.authService.validateApiKey(apiKey);
        done(null, user);
      } catch {
        done(new UnauthorizedException(), null);
      }
    });
  }
}
