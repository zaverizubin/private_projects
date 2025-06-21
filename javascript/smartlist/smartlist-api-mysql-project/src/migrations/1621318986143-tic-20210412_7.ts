import { MigrationInterface, QueryRunner } from 'typeorm';

export class tic2021041271621318986143 implements MigrationInterface {
  name = 'tic2021041271621318986143';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `candidate_assessment_score`');

    await queryRunner.query(
      'CREATE TABLE `candidate_response_score` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `modified_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `score` int NOT NULL, `candidate_id` int NOT NULL, `assessment_id` int NOT NULL, `assessment_block_id` int NOT NULL, `question_id` int NOT NULL, UNIQUE INDEX `candidate_response_score_idx` (`candidate_id`, `assessment_id`, `assessment_block_id`, `question_id`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_response_score` ADD CONSTRAINT `FK_e7c476b9b2253a0a3eb2bce7e53` FOREIGN KEY (`candidate_id`) REFERENCES `candidate`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_response_score` ADD CONSTRAINT `FK_c0e3025626bfa02946a7e5ce2cb` FOREIGN KEY (`assessment_id`) REFERENCES `assessment`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_response_score` ADD CONSTRAINT `FK_fd62b9cd2bf045f654b353c318a` FOREIGN KEY (`assessment_block_id`) REFERENCES `assessment_block`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_response_score` ADD CONSTRAINT `FK_fad8889d641dca588af2e7591b1` FOREIGN KEY (`question_id`) REFERENCES `question`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `candidate_response_score` DROP FOREIGN KEY `FK_fad8889d641dca588af2e7591b1`',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_response_score` DROP FOREIGN KEY `FK_fd62b9cd2bf045f654b353c318a`',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_response_score` DROP FOREIGN KEY `FK_c0e3025626bfa02946a7e5ce2cb`',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_response_score` DROP FOREIGN KEY `FK_e7c476b9b2253a0a3eb2bce7e53`',
    );
    await queryRunner.query(
      'DROP INDEX `candidate_response_score_idx` ON `candidate_response_score`',
    );
    await queryRunner.query('DROP TABLE `candidate_response_score`');
  }
}
