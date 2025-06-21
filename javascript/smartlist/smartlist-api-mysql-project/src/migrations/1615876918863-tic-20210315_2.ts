import { MigrationInterface, QueryRunner } from 'typeorm';

export class tic2021031521615876918863 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE user DROP COLUMN password_salt;');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE user ADD COLUMN password_salt VARCHAR(255) AFTER password;',
    );
  }
}
