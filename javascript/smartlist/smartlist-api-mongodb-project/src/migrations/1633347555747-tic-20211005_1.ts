import { MigrationInterface, QueryRunner } from 'typeorm';

export class tic2021100511633347555747 implements MigrationInterface {
  name = 'tic2021100511633347555747';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `assessment_block` ADD `questionPoint` int NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `assessment_block` ADD `randomQuestions` int NULL',
    );
    await queryRunner.query(
      "ALTER TABLE `assessment_block` ADD `suffleQuestions` tinyint NOT NULL DEFAULT '0'",
    );
    await queryRunner.query(
      "ALTER TABLE `question` ADD `suffleOptions` tinyint NOT NULL DEFAULT '0'",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `question` DROP COLUMN `suffleOptions`',
    );
    await queryRunner.query(
      'ALTER TABLE `assessment_block` DROP COLUMN `suffleQuestions`',
    );
    await queryRunner.query(
      'ALTER TABLE `assessment_block` DROP COLUMN `randomQuestions`',
    );
    await queryRunner.query(
      'ALTER TABLE `assessment_block` DROP COLUMN `questionPoint`',
    );
  }
}
