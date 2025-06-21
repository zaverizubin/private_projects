import { MigrationInterface, QueryRunner } from 'typeorm';

export class tic2021042311619277607007 implements MigrationInterface {
  name = 'tic2021042311619277607007';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `candidate_response` DROP COLUMN `answer`',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_response` ADD `answerText` varchar(5000) NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_response` ADD `answer_id` int NOT NULL',
    );
    await queryRunner.query('ALTER TABLE `candidate` ADD `photo_id` int NULL');
    await queryRunner.query(
      'ALTER TABLE `candidate` ADD UNIQUE INDEX `IDX_5be09bced593a469dca468df08` (`photo_id`)',
    );
    await queryRunner.query('ALTER TABLE `candidate` ADD `video_id` int NULL');
    await queryRunner.query(
      'ALTER TABLE `candidate` ADD UNIQUE INDEX `IDX_b19f44a126ab3ca7ab1ee4ed89` (`video_id`)',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate` DROP COLUMN `verification_code`',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate` ADD `verification_code` int NULL',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `REL_5be09bced593a469dca468df08` ON `candidate` (`photo_id`)',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `REL_b19f44a126ab3ca7ab1ee4ed89` ON `candidate` (`video_id`)',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_response` ADD CONSTRAINT `FK_8b9d500b0e830adf30e4ea48f4f` FOREIGN KEY (`answer_id`) REFERENCES `answer_option`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate` ADD CONSTRAINT `FK_5be09bced593a469dca468df083` FOREIGN KEY (`photo_id`) REFERENCES `file`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate` ADD CONSTRAINT `FK_b19f44a126ab3ca7ab1ee4ed89a` FOREIGN KEY (`video_id`) REFERENCES `file`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `candidate` DROP FOREIGN KEY `FK_b19f44a126ab3ca7ab1ee4ed89a`',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate` DROP FOREIGN KEY `FK_5be09bced593a469dca468df083`',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_response` DROP FOREIGN KEY `FK_8b9d500b0e830adf30e4ea48f4f`',
    );
    await queryRunner.query(
      'DROP INDEX `REL_b19f44a126ab3ca7ab1ee4ed89` ON `candidate`',
    );
    await queryRunner.query(
      'DROP INDEX `REL_5be09bced593a469dca468df08` ON `candidate`',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate` DROP COLUMN `verification_code`',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate` ADD `verification_code` varchar(255) NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate` DROP INDEX `IDX_b19f44a126ab3ca7ab1ee4ed89`',
    );
    await queryRunner.query('ALTER TABLE `candidate` DROP COLUMN `video_id`');
    await queryRunner.query(
      'ALTER TABLE `candidate` DROP INDEX `IDX_5be09bced593a469dca468df08`',
    );
    await queryRunner.query('ALTER TABLE `candidate` DROP COLUMN `photo_id`');
    await queryRunner.query(
      'ALTER TABLE `candidate_response` DROP COLUMN `answer_id`',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_response` DROP COLUMN `answerText`',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_response` ADD `answer` varchar(5000) NOT NULL',
    );
  }
}
