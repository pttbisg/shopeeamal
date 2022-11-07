import { Injectable } from '@nestjs/common';

import { UserStatus } from '../../constants';
import { UserNotFoundException } from '../../exceptions';
import { ApiConfigService } from '../../shared/services/api-config.service';
import type { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private configService: ApiConfigService,
    private userService: UserService,
  ) {}

  // TODO: Use the combination  of App-Id and Api Key for authentication
  // Then hash the API Key in DB. API Key can only be know once
  // bcrypt.compare(password, hash);
  // Alternatively. Change the API auth to other more secure method
  async validateApiKey(apiKey: string): Promise<UserEntity> {
    const user = await this.userService.findOne({
      apiKey,
      status: UserStatus.ACTIVE,
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }
}
