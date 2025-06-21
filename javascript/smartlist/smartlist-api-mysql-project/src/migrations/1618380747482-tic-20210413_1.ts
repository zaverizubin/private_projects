import { MigrationInterface, QueryRunner } from 'typeorm';

export class tic2021041311618380747482 implements MigrationInterface {
  name = 'tic2021041311618380747482';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `assessment_block` DROP COLUMN `deleted`',
    );
    await queryRunner.query(
      "ALTER TABLE `assessment` CHANGE `status` `status` enum ('draft', 'active', 'archived') NOT NULL DEFAULT 'draft'",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `assessment` CHANGE `status` `status` enum ('draft', 'active', 'archived', 'deleted') NOT NULL DEFAULT 'draft'",
    );
    await queryRunner.query(
      "ALTER TABLE `assessment_block` ADD `deleted` tinyint NOT NULL DEFAULT '0'",
    );
  }
}
