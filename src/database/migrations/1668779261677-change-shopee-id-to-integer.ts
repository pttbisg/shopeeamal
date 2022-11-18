import type { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeShopeeIdToInteger1668779261677
  implements MigrationInterface
{
  name = 'changeShopeeIdToInteger1668779261677';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "shopee-oauths" DROP CONSTRAINT "UQ_7a31cbe38a1dfab1e1f30788b17"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_7634c28b4c8bd0363803efa5d6"
        `);
    await queryRunner.query(`
            ALTER TABLE "shopee-oauths" DROP COLUMN "partner_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "shopee-oauths"
            ADD "partner_id" integer
        `);
    await queryRunner.query(`
            ALTER TABLE "shopee-oauths" DROP COLUMN "shop_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "shopee-oauths"
            ADD "shop_id" integer
        `);
    await queryRunner.query(`
            ALTER TABLE "shopee-oauths" DROP COLUMN "main_account_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "shopee-oauths"
            ADD "main_account_id" integer
        `);
    await queryRunner.query(`
            ALTER TABLE "shopee-oauths" DROP COLUMN "shop_ids"
        `);
    await queryRunner.query(`
            ALTER TABLE "shopee-oauths"
            ADD "shop_ids" integer array
        `);
    await queryRunner.query(`
            ALTER TABLE "shopee-oauths" DROP COLUMN "merchant_ids"
        `);
    await queryRunner.query(`
            ALTER TABLE "shopee-oauths"
            ADD "merchant_ids" integer array
        `);
    await queryRunner.query(`
            ALTER TABLE "shopee-oauths"
            ALTER COLUMN "status"
            SET DEFAULT 'CREATED'
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "partner_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "partner_id" integer
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_7634c28b4c8bd0363803efa5d6" ON "shopee-oauths" ("partner_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "shopee-oauths"
            ADD CONSTRAINT "UQ_7a31cbe38a1dfab1e1f30788b17" UNIQUE ("partner_id", "user_id")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "shopee-oauths" DROP CONSTRAINT "UQ_7a31cbe38a1dfab1e1f30788b17"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_7634c28b4c8bd0363803efa5d6"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "partner_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "partner_id" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "shopee-oauths"
            ALTER COLUMN "status"
            SET DEFAULT 'CREATED' - oauths_status_enum "
        `);
    await queryRunner.query(`
            ALTER TABLE "shopee-oauths" DROP COLUMN "merchant_ids"
        `);
    await queryRunner.query(`
            ALTER TABLE "shopee-oauths"
            ADD "merchant_ids" text array
        `);
    await queryRunner.query(`
            ALTER TABLE "shopee-oauths" DROP COLUMN "shop_ids"
        `);
    await queryRunner.query(`
            ALTER TABLE "shopee-oauths"
            ADD "shop_ids" text array
        `);
    await queryRunner.query(`
            ALTER TABLE "shopee-oauths" DROP COLUMN "main_account_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "shopee-oauths"
            ADD "main_account_id" character varying
        `);
    await queryRunner.query(`
            ALTER TABLE "shopee-oauths" DROP COLUMN "shop_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "shopee-oauths"
            ADD "shop_id" character varying
        `);
    await queryRunner.query(`
            ALTER TABLE "shopee-oauths" DROP COLUMN "partner_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "shopee-oauths"
            ADD "partner_id" character varying NOT NULL
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_7634c28b4c8bd0363803efa5d6" ON "shopee-oauths" ("partner_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "shopee-oauths"
            ADD CONSTRAINT "UQ_7a31cbe38a1dfab1e1f30788b17" UNIQUE ("partner_id", "user_id")
        `);
  }
}
