import { MigrationInterface, QueryRunner } from 'typeorm';

export class tic2021042311619617158921 implements MigrationInterface {
  name = 'tic2021042311619617158921';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `candidate_response` DROP FOREIGN KEY `FK_8b9d500b0e830adf30e4ea48f4f`',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_response` CHANGE `answer_id` `answer_id` int NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_response` ADD CONSTRAINT `FK_8b9d500b0e830adf30e4ea48f4f` FOREIGN KEY (`answer_id`) REFERENCES `answer_option`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `candidate_response` DROP FOREIGN KEY `FK_8b9d500b0e830adf30e4ea48f4f`',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_response` CHANGE `answer_id` `answer_id` int NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_response` ADD CONSTRAINT `FK_8b9d500b0e830adf30e4ea48f4f` FOREIGN KEY (`answer_id`) REFERENCES `answer_option`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }
}
