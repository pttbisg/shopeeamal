import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPartnerId1667907404026 implements MigrationInterface {
  name = 'addPartnerId1667907404026';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "partner_id" character varying NOT NULL DEFAULT ''
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."users_environment_enum" AS ENUM('LIVE', 'TEST')
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "environment" "public"."users_environment_enum" NOT NULL DEFAULT 'TEST'
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "environment"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."users_environment_enum"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "partner_id"
        `);
  }
}
