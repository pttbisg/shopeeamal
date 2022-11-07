import type { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserSchema1667840191706 implements MigrationInterface {
  name = 'updateUserSchema1667840191706';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "first_name"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "last_name"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "email"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "password"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "phone"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "avatar"
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "client_name" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "UQ_383c73d54e7165ec04601aa4bc9" UNIQUE ("client_name")
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "api_key" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "UQ_16bfa631de67a4fafe7ce3f2fed" UNIQUE ("api_key")
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."users_status_enum" AS ENUM('ACTIVE', 'INACTIVE')
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "status" "public"."users_status_enum" NOT NULL DEFAULT 'ACTIVE'
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_16bfa631de67a4fafe7ce3f2fe" ON "users" ("api_key")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."IDX_16bfa631de67a4fafe7ce3f2fe"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "status"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."users_status_enum"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "UQ_16bfa631de67a4fafe7ce3f2fed"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "api_key"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "UQ_383c73d54e7165ec04601aa4bc9"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "client_name"
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "avatar" character varying
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "phone" character varying
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "password" character varying
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "email" character varying
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "last_name" character varying
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "first_name" character varying
        `);
  }
}
