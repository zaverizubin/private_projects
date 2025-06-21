import { MigrationInterface, QueryRunner } from 'typeorm';

export class tic2021040511618298114565 implements MigrationInterface {
  name = 'tic2021040511618298114565';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `assessment` ADD `token` varchar(255) NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `assessment_block` ADD `deleted` tinyint NOT NULL DEFAULT 0',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `assessment_block` DROP COLUMN `deleted`',
    );
    await queryRunner.query('ALTER TABLE `assessment` DROP COLUMN `token`');
  }
}
