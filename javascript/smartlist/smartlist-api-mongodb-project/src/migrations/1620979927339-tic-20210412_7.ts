import { MigrationInterface, QueryRunner } from 'typeorm';

export class tic2021041271620979927339 implements MigrationInterface {
  name = 'tic2021041271620979927339';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `candidate_assessment_grade`');

    await queryRunner.query(
      "CREATE TABLE `candidate_assessment_decision` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `modified_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `assessmentDecision` enum ('smartlisted', 'shortlisted', 'basic_requirement_not_met', 'incomplete_responses') NOT NULL, `candidate_id` int NOT NULL, `assessment_id` int NOT NULL, UNIQUE INDEX `candidate_assessment_decision_idx` (`candidate_id`, `assessment_id`), PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_assessment_decision` ADD CONSTRAINT `FK_e7af01ef15ab4f827be11ea435e` FOREIGN KEY (`candidate_id`) REFERENCES `candidate`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_assessment_decision` ADD CONSTRAINT `FK_407ce9d6b75bdd90212e4a9648c` FOREIGN KEY (`assessment_id`) REFERENCES `assessment`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `candidate_assessment_decision` DROP FOREIGN KEY `FK_407ce9d6b75bdd90212e4a9648c`',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_assessment_decision` DROP FOREIGN KEY `FK_e7af01ef15ab4f827be11ea435e`',
    );
    await queryRunner.query(
      'DROP INDEX `candidate_assessment_decision_idx` ON `candidate_assessment_decision`',
    );
    await queryRunner.query('DROP TABLE `candidate_assessment_decision`');
  }
}
