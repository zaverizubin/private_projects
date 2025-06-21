import { MigrationInterface, QueryRunner } from 'typeorm';

export class tic2021041411621667128205 implements MigrationInterface {
  name = 'tic2021041411621667128205';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('delete from candidate_response_score');
    await queryRunner.query('delete from candidate_response');
    await queryRunner.query('delete from answer_option');
    await queryRunner.query('delete from question');

    await queryRunner.query(
      "ALTER TABLE `question` CHANGE `type` `type` enum ('scored_mcq_single', 'scored_mcq_multiple', 'survey', 'video_response', 'text_response') NOT NULL",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `question` CHANGE `type` `type` enum ('scored_mcq', 'video_response', 'text_response') NOT NULL",
    );
  }
}
