import { MigrationInterface, QueryRunner } from 'typeorm';

export class tic2021042311619682106384 implements MigrationInterface {
  name = 'tic2021042311619682106384';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `candidate_response` DROP FOREIGN KEY `FK_46bb7ed7d6eb9765f5ebb121caf`',
    );
    await queryRunner.query(
      'DROP INDEX `REL_46bb7ed7d6eb9765f5ebb121ca` ON `candidate_response`',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_response` ADD CONSTRAINT `FK_46bb7ed7d6eb9765f5ebb121caf` FOREIGN KEY (`question_id`) REFERENCES `question`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_5be09bced593a469dca468df08` ON `candidate`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_b19f44a126ab3ca7ab1ee4ed89` ON `candidate`',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE UNIQUE INDEX `IDX_b19f44a126ab3ca7ab1ee4ed89` ON `candidate` (`video_id`)',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `IDX_5be09bced593a469dca468df08` ON `candidate` (`photo_id`)',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `REL_46bb7ed7d6eb9765f5ebb121ca` ON `candidate_response` (`question_id`)',
    );
  }
}
