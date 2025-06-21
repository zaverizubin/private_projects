import { MigrationInterface, QueryRunner } from 'typeorm';

export class tic2021041211618210959961 implements MigrationInterface {
  name = 'tic2021041211618210959961';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `organization` ADD `email` varchar(255) NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `organization` DROP COLUMN `email`');
  }
}
