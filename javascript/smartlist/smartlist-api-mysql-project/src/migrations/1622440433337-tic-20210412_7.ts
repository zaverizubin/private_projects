import { MigrationInterface, QueryRunner } from 'typeorm';

export class tic2021041271622440433337 implements MigrationInterface {
  name = 'tic2021041271622440433337';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `candidate_assessment_decision`');
    await queryRunner.query(
      "ALTER TABLE `candidate_assessment` ADD `assessmentDecision` enum ('smartlisted', 'shortlisted', 'basic_requirement_not_met', 'incomplete_responses') NULL",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `candidate_assessment` DROP COLUMN `assessmentDecision`',
    );
  }
}
