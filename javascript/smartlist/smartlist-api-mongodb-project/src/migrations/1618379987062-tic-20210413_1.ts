import { MigrationInterface, QueryRunner } from 'typeorm';

export class tic2021041311618379987062 implements MigrationInterface {
  name = 'tic2021041311618379987062';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `assessment_block` DROP FOREIGN KEY `FK_7f684886e100ddd547bd3e0b432`',
    );
    await queryRunner.query(
      'ALTER TABLE `question` DROP FOREIGN KEY `FK_88a3724719d58ac01a71f802215`',
    );
    await queryRunner.query(
      'ALTER TABLE `answer_option` DROP FOREIGN KEY `FK_c8ff81963b1cf29c3e4188e5ba4`',
    );
    await queryRunner.query(
      'ALTER TABLE `assessment_block` ADD CONSTRAINT `FK_7f684886e100ddd547bd3e0b432` FOREIGN KEY (`assessment_id`) REFERENCES `assessment`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `question` ADD CONSTRAINT `FK_88a3724719d58ac01a71f802215` FOREIGN KEY (`assessment_block_id`) REFERENCES `assessment_block`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `answer_option` ADD CONSTRAINT `FK_c8ff81963b1cf29c3e4188e5ba4` FOREIGN KEY (`question_id`) REFERENCES `question`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `answer_option` DROP FOREIGN KEY `FK_c8ff81963b1cf29c3e4188e5ba4`',
    );
    await queryRunner.query(
      'ALTER TABLE `question` DROP FOREIGN KEY `FK_88a3724719d58ac01a71f802215`',
    );
    await queryRunner.query(
      'ALTER TABLE `assessment_block` DROP FOREIGN KEY `FK_7f684886e100ddd547bd3e0b432`',
    );
    await queryRunner.query(
      'ALTER TABLE `answer_option` ADD CONSTRAINT `FK_c8ff81963b1cf29c3e4188e5ba4` FOREIGN KEY (`question_id`) REFERENCES `question`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `question` ADD CONSTRAINT `FK_88a3724719d58ac01a71f802215` FOREIGN KEY (`assessment_block_id`) REFERENCES `assessment_block`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `assessment_block` ADD CONSTRAINT `FK_7f684886e100ddd547bd3e0b432` FOREIGN KEY (`assessment_id`) REFERENCES `assessment`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }
}
