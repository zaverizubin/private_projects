import { MigrationInterface, QueryRunner } from 'typeorm';

export class tic2021031521624424450477 implements MigrationInterface {
  name = 'tic2021031521624424450477';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user` ADD `designation` varchar(255) NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `designation`');
  }
}
