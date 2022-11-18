import { Column, Entity, Index, Unique } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { ShopeeOauthStatus } from '../../constants';
import { UseDto } from '../../decorators/use-dto.decorator';
import { ShopeeOauthDto } from './dtos/shopee-oauth.dto';

@Entity({ name: 'shopee-oauths' })
@Unique(['partnerId', 'userId'])
@UseDto(ShopeeOauthDto)
export class ShopeeOauthEntity extends AbstractEntity<ShopeeOauthDto> {
  @Index()
  @Column({ type: 'integer', nullable: false })
  partnerId: number;

  @Index()
  @Column({ nullable: false })
  userId: string;

  @Column({ type: 'integer', nullable: true })
  shopId: number;

  // Future schema to handle Subaccount features on Shopee
  // That allow 1 main account to have multiple Shops and member accounts
  @Column({ type: 'integer', nullable: true })
  mainAccountId: number;

  // shopIds will always be filled with single shopId for now
  @Column({ type: 'integer', array: true, nullable: true })
  shopIds: number[];

  @Column({ type: 'integer', array: true, nullable: true })
  merchantIds: number[];

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

  public get isAccessTokenExpired(): boolean {
    const margin = 60 * 1000; // 1 minute
    const now = new Date();

    return now.getTime() - margin > this.accessTokenExpiredAt.getTime();
  }

  public get isRefreshTokenExpired(): boolean {
    const margin = 24 * 60 * 60 * 1000; // 1 day
    const now = new Date();

    return now.getTime() - margin > this.refreshTokenExpiredAt.getTime();
  }
}
