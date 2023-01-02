/* eslint-disable @typescript-eslint/naming-convention */
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import type { Response } from 'node-fetch';
import fetch from 'node-fetch';

import { ApiConfigService } from './api-config.service';

export interface IUserInfo {
  id: string;
  firstName?: string;
  lastName?: string;
  username: string;
  role: string;
  avatar?: string;
  phone?: string;
  email: string;
  isActive?: boolean;
  settings?: never;
}

@Injectable()
export class BackendApiService {
  private readonly logger = new Logger(BackendApiService.name);

  private host: string;

  constructor(public configService: ApiConfigService) {
    this.logger.debug(configService);
  }

  public get baseUrl(): string {
    this.logger.debug(this.configService);
    this.host = this.configService.backendUrl.url;

    return this.host;
  }

  public async verifyJWT(jwt: string) {
    const fullUrl = `${this.baseUrl}/v1/auth/me`;
    const method = 'GET';
    const fetchOptions: Record<string, unknown> = { method };
    fetchOptions.headers = { 'Content-Type': 'application/json' };
    fetchOptions.headers = { Authorization: `Bearer ${jwt}` };

    let response: Response;

    try {
      response = await fetch(fullUrl, fetchOptions);
    } catch {
      throw new InternalServerErrorException({
        message: 'Error when accessing Backend API',
      });
    }

    const data = await response.json();
    this.logger.debug({
      request: {
        fullUrl,
      },
      response: {
        status: response.status,
        data,
      },
    });

    if (!response.ok || data.error) {
      throw new InternalServerErrorException({
        message: 'Error when accessing Backend API',
      });
    }

    return data;
  }
}
