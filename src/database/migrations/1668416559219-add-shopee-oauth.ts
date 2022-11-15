import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddShopeeOauth1668416559219 implements MigrationInterface {
  name = 'addShopeeOauth1668416559219';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "orders" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "shopee-oauths" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "partner_id" character varying NOT NULL,
                "user_id" character varying NOT NULL,
                "shop_id" character varying NOT NULL,
                "main_account_id" character varying NOT NULL,
                "shop_ids" text array NOT NULL,
                "merchant_ids" text array NOT NULL,
                "access_token" character varying NOT NULL,
                "refresh_token" character varying NOT NULL,
                "access_token_updated_at" TIMESTAMP NOT NULL,
                "refresh_token_updated_at" TIMESTAMP NOT NULL,
                "access_token_expired_at" TIMESTAMP NOT NULL,
                "refresh_token_expired_at" TIMESTAMP NOT NULL,
                CONSTRAINT "UQ_7a31cbe38a1dfab1e1f30788b17" UNIQUE ("partner_id", "user_id"),
                CONSTRAINT "PK_f37eab6f613cffde63f89c26490" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_7634c28b4c8bd0363803efa5d6" ON "shopee-oauths" ("partner_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_6413705b1554e1ccd70d8ff1df" ON "shopee-oauths" ("user_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "partner_key" character varying
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."users_location_enum" AS ENUM(
                'AF',
                'AX',
                'AL',
                'DZ',
                'AS',
                'AD',
                'AO',
                'AI',
                'AQ',
                'AG',
                'AR',
                'AM',
                'AW',
                'AU',
                'AT',
                'AZ',
                'BS',
                'BH',
                'BD',
                'BB',
                'BY',
                'BE',
                'BZ',
                'BJ',
                'BM',
                'BT',
                'BO',
                'BQ',
                'BA',
                'BW',
                'BV',
                'BR',
                'IO',
                'BN',
                'BG',
                'BF',
                'BI',
                'KH',
                'CM',
                'CA',
                'CV',
                'KY',
                'CF',
                'TD',
                'CL',
                'CN',
                'CX',
                'CC',
                'CO',
                'KM',
                'CG',
                'CD',
                'CK',
                'CR',
                'CI',
                'HR',
                'CU',
                'CW',
                'CY',
                'CZ',
                'DK',
                'DJ',
                'DM',
                'DO',
                'EC',
                'EG',
                'SV',
                'GQ',
                'ER',
                'EE',
                'ET',
                'FK',
                'FO',
                'FJ',
                'FI',
                'FR',
                'GF',
                'PF',
                'TF',
                'GA',
                'GM',
                'GE',
                'DE',
                'GH',
                'GI',
                'GR',
                'GL',
                'GD',
                'GP',
                'GU',
                'GT',
                'GG',
                'GN',
                'GW',
                'GY',
                'HT',
                'HM',
                'VA',
                'HN',
                'HK',
                'HU',
                'IS',
                'IN',
                'ID',
                'IR',
                'IQ',
                'IE',
                'IM',
                'IL',
                'IT',
                'JM',
                'JP',
                'JE',
                'JO',
                'KZ',
                'KE',
                'KI',
                'KR',
                'KP',
                'KW',
                'KG',
                'LA',
                'LV',
                'LB',
                'LS',
                'LR',
                'LY',
                'LI',
                'LT',
                'LU',
                'MO',
                'MK',
                'MG',
                'MW',
                'MY',
                'MV',
                'ML',
                'MT',
                'MH',
                'MQ',
                'MR',
                'MU',
                'YT',
                'MX',
                'FM',
                'MD',
                'MC',
                'MN',
                'ME',
                'MS',
                'MA',
                'MZ',
                'MM',
                'NA',
                'NR',
                'NP',
                'NL',
                'NC',
                'NZ',
                'NI',
                'NE',
                'NG',
                'NU',
                'NF',
                'MP',
                'NO',
                'OM',
                'PK',
                'PW',
                'PS',
                'PA',
                'PG',
                'PY',
                'PE',
                'PH',
                'PN',
                'PL',
                'PT',
                'PR',
                'QA',
                'RE',
                'RO',
                'RU',
                'RW',
                'BL',
                'SH',
                'KN',
                'LC',
                'MF',
                'PM',
                'VC',
                'WS',
                'SM',
                'ST',
                'SA',
                'SN',
                'RS',
                'SC',
                'SL',
                'SG',
                'SX',
                'SK',
                'SI',
                'SB',
                'SO',
                'ZA',
                'GS',
                'SS',
                'ES',
                'LK',
                'SD',
                'SR',
                'SJ',
                'SZ',
                'SE',
                'CH',
                'SY',
                'TW',
                'TJ',
                'TZ',
                'TH',
                'TL',
                'TG',
                'TK',
                'TO',
                'TT',
                'TN',
                'TR',
                'TM',
                'TC',
                'TV',
                'UG',
                'UA',
                'AE',
                'GB',
                'US',
                'UM',
                'UY',
                'UZ',
                'VU',
                'VE',
                'VN',
                'VG',
                'VI',
                'WF',
                'EH',
                'YE',
                'ZM',
                'ZW'
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "location" "public"."users_location_enum" NOT NULL DEFAULT 'SG'
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "partner_id" DROP DEFAULT
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_3676155292d72c67cd4e090514" ON "users" ("status")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."IDX_3676155292d72c67cd4e090514"
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "partner_id"
            SET DEFAULT ''
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "location"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."users_location_enum"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "partner_key"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_6413705b1554e1ccd70d8ff1df"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_7634c28b4c8bd0363803efa5d6"
        `);
    await queryRunner.query(`
            DROP TABLE "shopee-oauths"
        `);
    await queryRunner.query(`
            DROP TABLE "orders"
        `);
  }
}
