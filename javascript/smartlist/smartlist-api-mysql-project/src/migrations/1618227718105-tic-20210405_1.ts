import { MigrationInterface, QueryRunner } from 'typeorm';

export class tic2021040511618227718105 implements MigrationInterface {
  name = 'tic2021040511618227718105';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `assessment` DROP FOREIGN KEY `FK_f05d972c8eb7f0be663272d6cb4`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_2863d588f4efce8bf42c9c6352` ON `user`',
    );
    await queryRunner.query(
      'DROP INDEX `REL_f05d972c8eb7f0be663272d6cb` ON `assessment`',
    );
    await queryRunner.query(
      'ALTER TABLE `assessment` CHANGE `video_link_id` `video_link_url` int NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `assessment` DROP COLUMN `video_link_url`',
    );
    await queryRunner.query(
      'ALTER TABLE `assessment` ADD `video_link_url` varchar(255) NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `assessment` DROP COLUMN `video_link_url`',
    );
    await queryRunner.query(
      'ALTER TABLE `assessment` ADD `video_link_url` int NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `assessment` CHANGE `video_link_url` `video_link_id` int NULL',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `REL_f05d972c8eb7f0be663272d6cb` ON `assessment` (`video_link_id`)',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `IDX_2863d588f4efce8bf42c9c6352` ON `user` (`photo_id`)',
    );
    await queryRunner.query(
      'ALTER TABLE `assessment` ADD CONSTRAINT `FK_f05d972c8eb7f0be663272d6cb4` FOREIGN KEY (`video_link_id`) REFERENCES `file`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }
}
