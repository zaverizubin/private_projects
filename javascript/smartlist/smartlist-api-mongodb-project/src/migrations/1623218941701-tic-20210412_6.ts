import { MigrationInterface, QueryRunner } from 'typeorm';

export class tic2021041261623218941701 implements MigrationInterface {
  name = 'tic2021041261623218941701';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `candidate_attempt_log` (`id` int NOT NULL AUTO_INCREMENT, `attempted_on` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `candidate_id` int NOT NULL, `assessment_id` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_attempt_log` ADD CONSTRAINT `FK_fa1e7702394810c539324a04b28` FOREIGN KEY (`candidate_id`) REFERENCES `candidate`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_attempt_log` ADD CONSTRAINT `FK_d4aaf41835e95bc55991f2ca414` FOREIGN KEY (`assessment_id`) REFERENCES `assessment`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `candidate_attempt_log` DROP FOREIGN KEY `FK_d4aaf41835e95bc55991f2ca414`',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_attempt_log` DROP FOREIGN KEY `FK_fa1e7702394810c539324a04b28`',
    );
    await queryRunner.query('DROP TABLE `candidate_attempt_log`');
  }
}
