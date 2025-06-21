import { MigrationInterface, QueryRunner } from 'typeorm';

export class tic2021031521617802049289 implements MigrationInterface {
  name = 'tic2021031521617802049289';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `user` ADD `photo_id` int NULL');
    await queryRunner.query(
      'ALTER TABLE `user` ADD UNIQUE INDEX `IDX_2863d588f4efce8bf42c9c6352` (`photo_id`)',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `REL_2863d588f4efce8bf42c9c6352` ON `user` (`photo_id`)',
    );
    await queryRunner.query(
      'ALTER TABLE `user` ADD CONSTRAINT `FK_2863d588f4efce8bf42c9c63526` FOREIGN KEY (`photo_id`) REFERENCES `file`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user` DROP FOREIGN KEY `FK_2863d588f4efce8bf42c9c63526`',
    );
    await queryRunner.query(
      'DROP INDEX `REL_2863d588f4efce8bf42c9c6352` ON `user`',
    );
    await queryRunner.query(
      'ALTER TABLE `user` DROP INDEX `IDX_2863d588f4efce8bf42c9c6352`',
    );
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `photo_id`');
  }
}
