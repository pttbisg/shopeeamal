import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTestEnvironment1668609724665 implements MigrationInterface {
  name = 'addTestEnvironment1668609724665';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "shopee-oauths"
            ALTER COLUMN "status"
            SET DEFAULT 'CREATED'
        `);
    await queryRunner.query(`
            ALTER TYPE "public"."users_environment_enum"
            RENAME TO "users_environment_enum_old"
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."users_environment_enum" AS ENUM('LIVE', 'SANDBOX', 'TEST')
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "environment" DROP DEFAULT
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "environment" TYPE "public"."users_environment_enum" USING "environment"::"text"::"public"."users_environment_enum"
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "environment"
            SET DEFAULT 'TEST'
        `);
    await queryRunner.query(`
            DROP TYPE "public"."users_environment_enum_old"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."users_environment_enum_old" AS ENUM('LIVE', 'TEST')
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "environment" DROP DEFAULT
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "environment" TYPE "public"."users_environment_enum_old" USING "environment"::"text"::"public"."users_environment_enum_old"
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "environment"
            SET DEFAULT 'TEST'
        `);
    await queryRunner.query(`
            DROP TYPE "public"."users_environment_enum"
        `);
    await queryRunner.query(`
            ALTER TYPE "public"."users_environment_enum_old"
            RENAME TO "users_environment_enum"
        `);
    await queryRunner.query(`
            ALTER TABLE "shopee-oauths"
            ALTER COLUMN "status"
            SET DEFAULT 'CREATED' - oauths_status_enum "
        `);
  }
}
