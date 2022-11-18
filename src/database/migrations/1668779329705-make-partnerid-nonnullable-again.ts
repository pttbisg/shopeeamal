import type { MigrationInterface, QueryRunner } from 'typeorm';

export class MakePartneridNonnullableAgain1668779329705
  implements MigrationInterface
{
  name = 'makePartneridNonnullableAgain1668779329705';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "shopee-oauths" DROP CONSTRAINT "UQ_7a31cbe38a1dfab1e1f30788b17"
        `);
    await queryRunner.query(`
            ALTER TABLE "shopee-oauths"
            ALTER COLUMN "partner_id"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "shopee-oauths"
            ALTER COLUMN "status"
            SET DEFAULT 'CREATED'
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "partner_id"
            SET NOT NULL
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
            ALTER TABLE "users"
            ALTER COLUMN "partner_id" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "shopee-oauths"
            ALTER COLUMN "status"
            SET DEFAULT 'CREATED' - oauths_status_enum "
        `);
    await queryRunner.query(`
            ALTER TABLE "shopee-oauths"
            ALTER COLUMN "partner_id" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "shopee-oauths"
            ADD CONSTRAINT "UQ_7a31cbe38a1dfab1e1f30788b17" UNIQUE ("user_id", "partner_id")
        `);
  }
}
