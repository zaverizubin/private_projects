import { MigrationInterface, QueryRunner } from 'typeorm';

export class tic2021042311625146868451 implements MigrationInterface {
  name = 'tic2021042311625146868451';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `candidate_assessment` ADD `status` enum ('in_progress', 'grading_pending', 'grading_completed') NOT NULL DEFAULT 'in_progress'",
    );
    await queryRunner.query(
      'UPDATE candidate_assessment SET assessmentDecision=NULL',
    );
    await queryRunner.query(
      "ALTER TABLE `candidate_assessment` CHANGE `assessmentDecision` `assessmentDecision` enum ('smartlisted', 'shortlisted', 'on_hold', 'regret') NULL",
    );

    await queryRunner.query(
      'ALTER TABLE `candidate_assessment` DROP COLUMN `completed`',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `candidate_assessment` CHANGE `assessmentDecision` `assessmentDecision` enum ('smartlisted', 'shortlisted', 'basic_requirement_not_met', 'incomplete_responses') NULL",
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_assessment` DROP COLUMN `status`',
    );

    await queryRunner.query(
      "ALTER TABLE `candidate_assessment` ADD `completed` tinyint NOT NULL DEFAULT '0'",
    );
  }
}
