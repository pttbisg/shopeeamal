import { Column, Entity, Index, Unique } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { ShopeeOauthStatus } from '../../constants';
import { UseDto } from '../../decorators';
import { ShopeeOauthDto } from './dtos/shopee-oauth.dto';

@Entity({ name: 'shopee-oauths' })
@Unique(['partnerId', 'userId'])
@UseDto(ShopeeOauthDto)
export class ShopeeOauthEntity extends AbstractEntity<ShopeeOauthDto> {
  @Index()
  @Column({ nullable: false })
  partnerId: string;

  @Index()
  @Column({ nullable: false })
  userId: string;

  @Column({ nullable: true })
  shopId: string;

  // Future schema to handle Subaccount features on Shopee
  // That allow 1 main account to have multiple Shops and member accounts
  @Column({ nullable: true })
  mainAccountId: string;

  // shopIds will always be filled with single shopId for now
  @Column({ type: 'text', array: true, nullable: true })
  shopIds: string[];

  @Column({ type: 'text', array: true, nullable: true })
  merchantIds: string[];

  @Column({ nullable: true })
  accessToken: string;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  accessTokenUpdatedAt: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  refreshTokenUpdatedAt: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  accessTokenExpiredAt: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  refreshTokenExpiredAt: Date;

  @Index()
  @Column({
    type: 'enum',
    enum: ShopeeOauthStatus,
    default: ShopeeOauthStatus.CREATED,
  })
  status: ShopeeOauthStatus;
}
