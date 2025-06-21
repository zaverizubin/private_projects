import { MigrationInterface, QueryRunner } from 'typeorm';

export class tic2021042311619852753687 implements MigrationInterface {
  name = 'tic2021042311619852753687';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `candidate` DROP FOREIGN KEY `FK_b19f44a126ab3ca7ab1ee4ed89a`',
    );
    await queryRunner.query(
      'DROP INDEX `REL_b19f44a126ab3ca7ab1ee4ed89` ON `candidate`',
    );
    await queryRunner.query('ALTER TABLE `candidate` DROP COLUMN `video_id`');
    await queryRunner.query(
      'ALTER TABLE `candidate` CHANGE `contact_number` `contact_number` varchar(255) NOT NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `candidate` CHANGE `contact_number` `contact_number` varchar(255) NULL',
    );
    await queryRunner.query('ALTER TABLE `candidate` ADD `video_id` int NULL');
    await queryRunner.query(
      'CREATE UNIQUE INDEX `REL_b19f44a126ab3ca7ab1ee4ed89` ON `candidate` (`video_id`)',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate` ADD CONSTRAINT `FK_b19f44a126ab3ca7ab1ee4ed89a` FOREIGN KEY (`video_id`) REFERENCES `file`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }
}
