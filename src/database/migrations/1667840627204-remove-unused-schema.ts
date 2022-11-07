import type { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveUnusedSchema1667840627204 implements MigrationInterface {
  name = 'removeUnusedSchema1667840627204';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_settings"
      DROP CONSTRAINT IF EXISTS "FK_4ed056b9344e6f7d8d46ec4b302"`);
    await queryRunner.query(`ALTER TABLE "posts"
      DROP CONSTRAINT IF EXISTS "FK_c4f9a7bd77b489e711277ee5986"`);
    await queryRunner.query(`ALTER TABLE "post_translations"
      DROP CONSTRAINT IF EXISTS "FK_11f143c8b50a9ff60340edca475"`);
    await queryRunner.query('DROP TABLE "posts"');
    await queryRunner.query('DROP TABLE "post_translations"');
    await queryRunner.query(
      'DROP TYPE "public"."post_translations_language_code_enum"',
    );

    await queryRunner.query(`ALTER TABLE "user_settings"
    DROP CONSTRAINT IF EXISTS  "FK_19f4e08665a1f4bbbb7d5631f35"`);
    await queryRunner.query('DROP TABLE "user_settings"');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(``);
  }
}
