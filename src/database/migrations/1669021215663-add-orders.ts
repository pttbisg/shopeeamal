import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrders1669021215663 implements MigrationInterface {
  name = 'addOrders1669021215663';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD "order_sn" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD "raw" json
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."orders_order_status_enum" AS ENUM(
                'UNPAID',
                'READY_TO_SHIP',
                'PROCESSED',
                'RETRY_SHIP',
                'SHIPPED',
                'TO_CONFIRM_RECEIVE',
                'COMPLETED',
                'IN_CANCEL',
                'CANCELLED',
                'TO_RETURN',
                'INVOICE_PENDING'
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD "order_status" "public"."orders_order_status_enum"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD "region" character varying
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD "currency" character varying
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD "cod" boolean
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD "total_amount" integer
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD "shipping_carrier" character varying
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD "payment_method" character varying
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD "estimated_shipping_fee" integer
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD "message_to_seller" character varying
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD "create_time" integer
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD "update_time" integer
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD "days_to_ship" integer
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD "ship_by_date" integer
        `);
    await queryRunner.query(`
            ALTER TABLE "shopee-oauths"
            ALTER COLUMN "status"
            SET DEFAULT 'CREATED'
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_e29950bb5d40c51c9fe7f5acf4" ON "orders" ("order_sn")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."IDX_e29950bb5d40c51c9fe7f5acf4"
        `);
    await queryRunner.query(`
            ALTER TABLE "shopee-oauths"
            ALTER COLUMN "status"
            SET DEFAULT 'CREATED' - oauths_status_enum "
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP COLUMN "ship_by_date"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP COLUMN "days_to_ship"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP COLUMN "update_time"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP COLUMN "create_time"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP COLUMN "message_to_seller"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP COLUMN "estimated_shipping_fee"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP COLUMN "payment_method"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP COLUMN "shipping_carrier"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP COLUMN "total_amount"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP COLUMN "cod"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP COLUMN "currency"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP COLUMN "region"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP COLUMN "order_status"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."orders_order_status_enum"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP COLUMN "raw"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP COLUMN "order_sn"
        `);
  }
}
