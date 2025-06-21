import { MigrationInterface, QueryRunner } from 'typeorm';

export class tic2021041271620810824961 implements MigrationInterface {
  name = 'tic2021041271620810824961';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `candidate_assessment_grade` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `modified_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `assessmentDecision` varchar(255) NOT NULL, `candidate_id` int NOT NULL, `assessment_id` int NOT NULL, UNIQUE INDEX `candidate_assessment_grade_idx` (`candidate_id`, `assessment_id`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'CREATE TABLE `candidate_assessment_score` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `modified_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `score` int NOT NULL, `candidate_id` int NOT NULL, `assessment_id` int NOT NULL, `assessment_block_id` int NOT NULL, `question_id` int NOT NULL, UNIQUE INDEX `candidate_assessment_score_idx` (`candidate_id`, `assessment_id`, `assessment_block_id`, `question_id`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_assessment_grade` ADD CONSTRAINT `FK_50ac52c8fd2c64f6be5c34f2457` FOREIGN KEY (`candidate_id`) REFERENCES `candidate`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_assessment_grade` ADD CONSTRAINT `FK_5db820be367f0a107afc10d2e50` FOREIGN KEY (`assessment_id`) REFERENCES `assessment`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_assessment_score` ADD CONSTRAINT `FK_558fa286842062caf9a0716cd13` FOREIGN KEY (`candidate_id`) REFERENCES `candidate`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_assessment_score` ADD CONSTRAINT `FK_a8d98cfb34f21000ba2ff444f7d` FOREIGN KEY (`assessment_id`) REFERENCES `assessment`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_assessment_score` ADD CONSTRAINT `FK_a610193c45b1c1e604e6bfac982` FOREIGN KEY (`assessment_block_id`) REFERENCES `assessment_block`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_assessment_score` ADD CONSTRAINT `FK_8184fcbce66328108d3ae1df6cd` FOREIGN KEY (`question_id`) REFERENCES `question`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `candidate_assessment_score` DROP FOREIGN KEY `FK_8184fcbce66328108d3ae1df6cd`',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_assessment_score` DROP FOREIGN KEY `FK_a610193c45b1c1e604e6bfac982`',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_assessment_score` DROP FOREIGN KEY `FK_a8d98cfb34f21000ba2ff444f7d`',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_assessment_score` DROP FOREIGN KEY `FK_558fa286842062caf9a0716cd13`',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_assessment_grade` DROP FOREIGN KEY `FK_5db820be367f0a107afc10d2e50`',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_assessment_grade` DROP FOREIGN KEY `FK_50ac52c8fd2c64f6be5c34f2457`',
    );
    await queryRunner.query(
      'DROP INDEX `candidate_assessment_score_idx` ON `candidate_assessment_score`',
    );
    await queryRunner.query('DROP TABLE `candidate_assessment_score`');
    await queryRunner.query(
      'DROP INDEX `candidate_assessment_grade_idx` ON `candidate_assessment_grade`',
    );
    await queryRunner.query('DROP TABLE `candidate_assessment_grade`');
  }
}
