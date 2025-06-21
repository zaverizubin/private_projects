import { MigrationInterface, QueryRunner } from 'typeorm';

export class tic2021040511618292069644 implements MigrationInterface {
  name = 'tic2021040511618292069644';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `assessment` DROP COLUMN `active`');
    await queryRunner.query('ALTER TABLE `assessment` DROP COLUMN `published`');
    await queryRunner.query(
      "ALTER TABLE `assessment` ADD `status` enum ('draft', 'active', 'archived', 'deleted') NOT NULL DEFAULT 'draft'",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `assessment` DROP COLUMN `status`');
    await queryRunner.query(
      "ALTER TABLE `assessment` ADD `published` tinyint NOT NULL DEFAULT '0'",
    );
    await queryRunner.query(
      "ALTER TABLE `assessment` ADD `active` tinyint NOT NULL DEFAULT '0'",
    );
  }
}
