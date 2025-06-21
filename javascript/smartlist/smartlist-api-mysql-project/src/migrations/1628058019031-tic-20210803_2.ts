import { MigrationInterface, QueryRunner } from 'typeorm';

export class tic2021080321628058019031 implements MigrationInterface {
  name = 'tic2021080321628058019031';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `question` ADD `options` json NULL');
    await queryRunner.query(
      'ALTER TABLE `candidate_response` ADD `file_id` int NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_response` ADD UNIQUE INDEX `IDX_cf89540161f5e741595e41b598` (`file_id`)',
    );
    await queryRunner.query(
      "ALTER TABLE `question` CHANGE `type` `type` enum ('scored_mcq_single', 'scored_mcq_single_weighted_select', 'scored_mcq_multiple', 'survey', 'video_response', 'text_response', 'file_response') NOT NULL",
    );

    await queryRunner.query(
      'CREATE UNIQUE INDEX `REL_cf89540161f5e741595e41b598` ON `candidate_response` (`file_id`)',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_response` ADD CONSTRAINT `FK_cf89540161f5e741595e41b5982` FOREIGN KEY (`file_id`) REFERENCES `file`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `candidate_response` DROP FOREIGN KEY `FK_cf89540161f5e741595e41b5982`',
    );
    await queryRunner.query(
      'DROP INDEX `REL_cf89540161f5e741595e41b598` ON `candidate_response`',
    );

    await queryRunner.query(
      "ALTER TABLE `question` CHANGE `type` `type` enum ('scored_mcq_single', 'scored_mcq_single_weighted_select', 'scored_mcq_multiple', 'survey', 'video_response', 'text_response') NOT NULL",
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_response` DROP INDEX `IDX_cf89540161f5e741595e41b598`',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_response` DROP COLUMN `file_id`',
    );
    await queryRunner.query('ALTER TABLE `question` DROP COLUMN `options`');
  }
}
