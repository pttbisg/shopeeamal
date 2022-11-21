import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddShopIdOnOrder1669021723615 implements MigrationInterface {
  name = 'addShopIdOnOrder1669021723615';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD "shop_id" integer NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "shopee-oauths"
            ALTER COLUMN "status"
            SET DEFAULT 'CREATED'
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_33f20db82908f7685a5c0c58ac" ON "orders" ("shop_id")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."IDX_33f20db82908f7685a5c0c58ac"
        `);
    await queryRunner.query(`
            ALTER TABLE "shopee-oauths"
            ALTER COLUMN "status"
            SET DEFAULT 'CREATED' - oauths_status_enum "
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP COLUMN "shop_id"
        `);
  }
}
