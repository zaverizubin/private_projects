import { MigrationInterface, QueryRunner } from 'typeorm';

export class tic2021031221616677138174 implements MigrationInterface {
  name = 'tic2021031221616677138174';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user_email_verification` DROP PRIMARY KEY',
    );
    await queryRunner.query(
      'ALTER TABLE `user_email_verification` DROP COLUMN `id`',
    );
    await queryRunner.query(
      'ALTER TABLE `user_email_verification` ADD `id` int NOT NULL PRIMARY KEY AUTO_INCREMENT',
    );
    await queryRunner.query(
      'ALTER TABLE `user_forgot_password` DROP PRIMARY KEY',
    );
    await queryRunner.query(
      'ALTER TABLE `user_forgot_password` DROP COLUMN `id`',
    );
    await queryRunner.query(
      'ALTER TABLE `user_forgot_password` ADD `id` int NOT NULL PRIMARY KEY AUTO_INCREMENT',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user_forgot_password` DROP COLUMN `id`',
    );
    await queryRunner.query(
      'ALTER TABLE `user_forgot_password` ADD `id` int NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `user_forgot_password` ADD PRIMARY KEY (`id`)',
    );
    await queryRunner.query(
      'ALTER TABLE `user_email_verification` DROP COLUMN `id`',
    );
    await queryRunner.query(
      'ALTER TABLE `user_email_verification` ADD `id` int NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `user_email_verification` ADD PRIMARY KEY (`id`)',
    );
  }
}
