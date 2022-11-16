import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddShopeeOauthStatus1668573688263 implements MigrationInterface {
  name = 'addShopeeOauthStatus1668573688263';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."shopee-oauths_status_enum" AS ENUM(
                'CREATED',
                'INITIALIZED',
                'AUTHORIZED',
                'ACTIVE',
                'INACTIVE',
                'EXPIRED',
                'REVOKED',
                'FAILED'
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "shopee-oauths"
            ADD "status" "public"."shopee-oauths_status_enum" NOT NULL DEFAULT 'CREATED'
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_9d80294c3d21f364333efe27d9" ON "shopee-oauths" ("status")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."IDX_9d80294c3d21f364333efe27d9"
        `);
    await queryRunner.query(`
            ALTER TABLE "shopee-oauths" DROP COLUMN "status"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."shopee-oauths_status_enum"
        `);
  }
}
