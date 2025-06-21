import { MigrationInterface, QueryRunner } from 'typeorm';

export class tic2021080311628232040747 implements MigrationInterface {
  name = 'tic2021080311628232040747';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `candidate_response` DROP FOREIGN KEY `FK_43ab8fb388670030c8cacf82f68`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_cf89540161f5e741595e41b598` ON `candidate_response`',
    );
    await queryRunner.query(
      'DROP INDEX `REL_43ab8fb388670030c8cacf82f6` ON `candidate_response`',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_response` DROP COLUMN `video_file_id`',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `candidate_response` ADD `video_file_id` int NULL',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `REL_43ab8fb388670030c8cacf82f6` ON `candidate_response` (`video_file_id`)',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `IDX_cf89540161f5e741595e41b598` ON `candidate_response` (`file_id`)',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_response` ADD CONSTRAINT `FK_43ab8fb388670030c8cacf82f68` FOREIGN KEY (`video_file_id`) REFERENCES `file`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }
}
