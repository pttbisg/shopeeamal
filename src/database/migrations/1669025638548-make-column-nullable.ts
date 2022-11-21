import type { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeColumnNullable1669025638548 implements MigrationInterface {
  name = 'makeColumnNullable1669025638548';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "items"
            ALTER COLUMN "category_id" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "items"
            ALTER COLUMN "condition" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "items"
            ALTER COLUMN "has_model" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "items"
            ALTER COLUMN "promotion_id" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "items"
            ALTER COLUMN "item_dangerous" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "items"
            ALTER COLUMN "complaint_policy" DROP NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "items"
            ALTER COLUMN "complaint_policy"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "items"
            ALTER COLUMN "item_dangerous"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "items"
            ALTER COLUMN "promotion_id"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "items"
            ALTER COLUMN "has_model"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "items"
            ALTER COLUMN "condition"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "items"
            ALTER COLUMN "category_id"
            SET NOT NULL
        `);
  }
}
