import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';

import { ShopeeService } from '../../shared/services/shopee.service';

@Injectable()
export class ProxyService {
  constructor(private shopeeService: ShopeeService) {}

  async proxy(method: string, path: string, query = {}, payload = {}) {
    path = path.replace('/proxy/', '');

    try {
      if (method === 'GET') {
        return await this.shopeeService.apiGet(path, query);
      } else if (method === 'POST') {
        return await this.shopeeService.apiPost(path, payload, query);
      }
    } catch (error) {
      const errorMessage: Record<
        string,
        Record<string, string>
      > = error.getResponse();

      if (
        error instanceof InternalServerErrorException &&
        errorMessage.shopee_error.msg === 'no partner_id'
      ) {
        const newErrorMessage = {
          ...errorMessage,
          message:
            'Error when proxying Shopee API. Most likely that this is wrong path.',
        };

        throw new NotFoundException(newErrorMessage);
      }

      throw error;
    }

    throw new NotImplementedException(`Method ${method} is not supported`);
  }
}
