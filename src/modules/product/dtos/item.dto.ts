import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { ItemEntity } from '../item.entity';

export enum ItemStatus {
  NORMAL = 'NORMAL',
  BANNED = 'BANNED',
  DELETED = 'DELETED',
  UNLIST = 'UNLIST',
}

export enum ItemCondition {
  NEW = 'NEW',
  USED = 'USED',
}

export enum ItemComplaintPolicy {
  ONE_YEAR = 'ONE_YEAR',
  TWO_YEARS = 'TWO_YEARS',
  OVER_TWO_YEARS = 'OVER_TWO_YEARS',
}

export class ItemDto extends AbstractDto {
  constructor(entityName: ItemEntity) {
    super(entityName);
  }
}
