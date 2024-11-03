import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1730653763472 implements MigrationInterface {
  name = 'Init1730653763472';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL, "email" character varying(100) NOT NULL, "password" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_User_email" UNIQUE ("email"), CONSTRAINT "PK_User" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tokens" ("id" uuid NOT NULL, "verified" boolean NOT NULL DEFAULT false, "verify_token" character varying, "password_token" character varying, "invite_token" character varying, CONSTRAINT "PK_Token" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_Token_invite" ON "tokens" ("invite_token") `);
    await queryRunner.query(`CREATE INDEX "IDX_Token_password" ON "tokens" ("password_token") `);
    await queryRunner.query(`CREATE INDEX "IDX_Token_verify" ON "tokens" ("verify_token") `);
    await queryRunner.query(
      `CREATE TABLE "profiles" ("id" uuid NOT NULL, "name" character varying(100) NOT NULL, "gender" character(1), "date_of_birth" date, "phone" character varying(15), "address" character varying(255), "avatar" character varying(255), "bio" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_Profile" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "tokens" ADD CONSTRAINT "FK_Token_User" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "profiles" ADD CONSTRAINT "FK_Profile_User" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "profiles" DROP CONSTRAINT "FK_Profile_User"`);
    await queryRunner.query(`ALTER TABLE "tokens" DROP CONSTRAINT "FK_Token_User"`);
    await queryRunner.query(`DROP TABLE "profiles"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_Token_verify"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_Token_password"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_Token_invite"`);
    await queryRunner.query(`DROP TABLE "tokens"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
