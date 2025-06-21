import { MigrationInterface, QueryRunner } from 'typeorm';

export class tic2021072811627469169119 implements MigrationInterface {
  name = '2021072811627469169119';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `answer_option` ADD `score` int NULL');
    await queryRunner.query(
      "ALTER TABLE `question` CHANGE `type` `type` enum ('scored_mcq_single', 'scored_mcq_single_weighted_select', 'scored_mcq_multiple', 'survey', 'video_response', 'text_response') NOT NULL",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `question` CHANGE `type` `type` enum ('scored_mcq_single', 'scored_mcq_multiple', 'survey', 'video_response', 'text_response') CHARACTER SET \"latin1\" COLLATE \"latin1_swedish_ci\" NOT NULL",
    );
    await queryRunner.query('ALTER TABLE `answer_option` DROP COLUMN `score`');
  }
}
