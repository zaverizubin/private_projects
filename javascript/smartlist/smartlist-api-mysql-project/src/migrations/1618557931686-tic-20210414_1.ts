import { MigrationInterface, QueryRunner } from 'typeorm';

export class tic2021041411618557931686 implements MigrationInterface {
  name = 'tic2021041411618557931686';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `question` DROP COLUMN `type`');
    await queryRunner.query(
      "ALTER TABLE `question` ADD `type` enum ('scored_mcq', 'video_response', 'text_response') NOT NULL",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `question` DROP COLUMN `type`');
    await queryRunner.query(
      'ALTER TABLE `question` ADD `type` varchar(255) NOT NULL',
    );
  }
}
