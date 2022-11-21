import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMoreColumnOnOrder1669022848661 implements MigrationInterface {
  name = 'addMoreColumnOnOrder1669022848661';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD "buyer_user_id" integer
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD "buyer_username" character varying
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD "recipient_address" json
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD "actual_shipping_fee" integer
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD "goods_to_declare" boolean
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD "note" character varying
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD "note_update_time" integer
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD "item_list" json
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD "pay_time" integer
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD "dropshipper" character varying
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD "dropshipper_phone" character varying
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD "split_up" boolean
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD "buyer_cancel_reason" character varying
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD "cancel_by" character varying
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD "cancel_reason" character varying
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD "actual_shipping_fee_confirmed" boolean
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD "buyer_cpf_id" character varying
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD "fulfillment_flag" character varying
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD "pickup_done_time" integer
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD "package_list" json
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD "invoice_data" json
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD "checkout_shipping_carrier" character varying
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD "reverse_shipping_fee" integer
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD "order_chargeable_weight_gram" integer
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD "edt_from" integer
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD "edt_to" integer
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD "prescription_images" json
        `);
    await queryRunner.query(`
            ALTER TABLE "orders"
            ADD "prescription_check_status" integer
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "orders" DROP COLUMN "prescription_check_status"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP COLUMN "prescription_images"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP COLUMN "edt_to"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP COLUMN "edt_from"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP COLUMN "order_chargeable_weight_gram"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP COLUMN "reverse_shipping_fee"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP COLUMN "checkout_shipping_carrier"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP COLUMN "invoice_data"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP COLUMN "package_list"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP COLUMN "pickup_done_time"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP COLUMN "fulfillment_flag"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP COLUMN "buyer_cpf_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP COLUMN "actual_shipping_fee_confirmed"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP COLUMN "cancel_reason"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP COLUMN "cancel_by"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP COLUMN "buyer_cancel_reason"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP COLUMN "split_up"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP COLUMN "dropshipper_phone"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP COLUMN "dropshipper"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP COLUMN "pay_time"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP COLUMN "item_list"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP COLUMN "note_update_time"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP COLUMN "note"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP COLUMN "goods_to_declare"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP COLUMN "actual_shipping_fee"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP COLUMN "recipient_address"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP COLUMN "buyer_username"
        `);
    await queryRunner.query(`
            ALTER TABLE "orders" DROP COLUMN "buyer_user_id"
        `);
  }
}
