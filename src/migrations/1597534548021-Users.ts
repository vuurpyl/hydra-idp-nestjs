import { MigrationInterface, QueryRunner } from 'typeorm';

export class Users1597534548021 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    await queryRunner.query(
        `CREATE TABLE members
         (
             id           uuid                        NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
             first_name   VARCHAR                     NOT NULL,
             last_name    VARCHAR                     NOT NULL,
             title        VARCHAR                     NOT NULL,
             email        VARCHAR                     NOT NULL,
             username     VARCHAR                     NOT NULL,
             password     VARCHAR                     NOT NULL,
             updated_at   timestamp without time zone NOT NULL,
             created_at   timestamp without time zone NOT NULL,
             UNIQUE (email, username)
         )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }

}
