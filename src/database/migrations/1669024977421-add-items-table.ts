import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddItemsTable1669024977421 implements MigrationInterface {
  name = 'addItemsTable1669024977421';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."items_item_status_enum" AS ENUM('NORMAL', 'BANNED', 'DELETED', 'UNLIST')
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."items_condition_enum" AS ENUM('NEW', 'USED')
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."items_complaint_policy_enum" AS ENUM('ONE_YEAR', 'TWO_YEARS', 'OVER_TWO_YEARS')
        `);
    await queryRunner.query(`
            CREATE TABLE "items" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "item_id" integer NOT NULL,
                "raw" json,
                "shop_id" integer NOT NULL,
                "item_status" "public"."items_item_status_enum",
                "category_id" integer NOT NULL,
                "item_name" character varying,
                "description" character varying,
                "item_sku" character varying,
                "create_time" integer,
                "update_time" integer,
                "attribute_list" json,
                "price_info" json,
                "image" json,
                "weight" character varying,
                "dimension" json,
                "logistic_info" json,
                "preorder" json,
                "wholesales" json,
                "condition" "public"."items_condition_enum" NOT NULL,
                "has_model" boolean NOT NULL,
                "promotion_id" integer NOT NULL,
                "video_info" json,
                "brand" json,
                "item_dangerous" integer NOT NULL,
                "complaint_policy" "public"."items_complaint_policy_enum" NOT NULL,
                "tax_info" json,
                "stock_info_v2" json,
                "description_info" json,
                "description_type" character varying,
                "gtin_code" character varying,
                CONSTRAINT "PK_ba5885359424c15ca6b9e79bcf6" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_d0249fbc104e3bd71b5a0ecf3b" ON "items" ("item_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_6af17c017ee2f32f1172782439" ON "items" ("shop_id")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."IDX_6af17c017ee2f32f1172782439"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_d0249fbc104e3bd71b5a0ecf3b"
        `);
    await queryRunner.query(`
            DROP TABLE "items"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."items_complaint_policy_enum"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."items_condition_enum"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."items_item_status_enum"
        `);
  }
}
