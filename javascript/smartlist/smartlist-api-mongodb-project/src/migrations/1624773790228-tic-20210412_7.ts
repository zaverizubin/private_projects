import { MigrationInterface, QueryRunner } from 'typeorm';

export class tic2021041271624773790228 implements MigrationInterface {
  name = 'tic2021041271624773790228';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `question_comment` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `modified_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `username` varchar(100) NOT NULL, `comment` varchar(5000) NOT NULL, `question_id` int NOT NULL, `candidate_id` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'ALTER TABLE `question_comment` ADD CONSTRAINT `FK_c28db68b419f7fab487b4cac8c5` FOREIGN KEY (`question_id`) REFERENCES `question`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `question_comment` ADD CONSTRAINT `FK_a96f5021b2fea2fa5b17f62547d` FOREIGN KEY (`candidate_id`) REFERENCES `candidate`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `question_comment` DROP FOREIGN KEY `FK_a96f5021b2fea2fa5b17f62547d`',
    );
    await queryRunner.query(
      'ALTER TABLE `question_comment` DROP FOREIGN KEY `FK_c28db68b419f7fab487b4cac8c5`',
    );
    await queryRunner.query('DROP TABLE `question_comment`');
  }
}
