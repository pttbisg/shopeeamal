import { Column, Entity, Index, Unique } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
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

  @Column()
  shopId: string;

  // Future schema to handle Subaccount features on Shopee
  // That allow 1 main account to have multiple Shops and member accounts
  @Column()
  mainAccountId: string;

  // shopIds will always be filled with single shopId for now
  @Column({ type: 'text', array: true })
  shopIds: string[];

  @Column({ type: 'text', array: true })
  merchantIds: string[];

  @Column()
  accessToken: string;

  @Column()
  refreshToken: string;

  @Column({
    type: 'timestamp',
  })
  accessTokenUpdatedAt: Date;

  @Column({
    type: 'timestamp',
  })
  refreshTokenUpdatedAt: Date;

  @Column({
    type: 'timestamp',
  })
  accessTokenExpiredAt: Date;

  @Column({
    type: 'timestamp',
  })
  refreshTokenExpiredAt: Date;
}
