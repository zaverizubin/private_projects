import { MigrationInterface, QueryRunner } from 'typeorm';

export class tic2021031521616675181646 implements MigrationInterface {
  name = 'tic2021031521616675181646';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user_email_verification` ADD `id` int NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `user_email_verification` DROP PRIMARY KEY',
    );
    await queryRunner.query(
      'ALTER TABLE `user_email_verification` ADD PRIMARY KEY (`user_id`, `id`)',
    );
    await queryRunner.query(
      'ALTER TABLE `user_forgot_password` ADD `id` int NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `user_forgot_password` DROP PRIMARY KEY',
    );
    await queryRunner.query(
      'ALTER TABLE `user_forgot_password` ADD PRIMARY KEY (`user_id`, `id`)',
    );
    await queryRunner.query(
      'ALTER TABLE `user_email_verification` DROP FOREIGN KEY `FK_81832c6c8b7adee780d10766860`',
    );
    await queryRunner.query(
      'ALTER TABLE `user_email_verification` CHANGE `user_id` `user_id` int NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `user_email_verification` DROP PRIMARY KEY',
    );
    await queryRunner.query(
      'ALTER TABLE `user_email_verification` ADD PRIMARY KEY (`id`)',
    );
    await queryRunner.query(
      'ALTER TABLE `user_forgot_password` DROP FOREIGN KEY `FK_e87f50685d51afcf4cecd428e2f`',
    );
    await queryRunner.query(
      'ALTER TABLE `user_forgot_password` CHANGE `user_id` `user_id` int NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `user_forgot_password` DROP PRIMARY KEY',
    );
    await queryRunner.query(
      'ALTER TABLE `user_forgot_password` ADD PRIMARY KEY (`id`)',
    );
    await queryRunner.query(
      'ALTER TABLE `user_email_verification` ADD CONSTRAINT `FK_81832c6c8b7adee780d10766860` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `user_forgot_password` ADD CONSTRAINT `FK_e87f50685d51afcf4cecd428e2f` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user_forgot_password` DROP FOREIGN KEY `FK_e87f50685d51afcf4cecd428e2f`',
    );
    await queryRunner.query(
      'ALTER TABLE `user_email_verification` DROP FOREIGN KEY `FK_81832c6c8b7adee780d10766860`',
    );
    await queryRunner.query(
      'ALTER TABLE `user_forgot_password` DROP PRIMARY KEY',
    );
    await queryRunner.query(
      'ALTER TABLE `user_forgot_password` ADD PRIMARY KEY (`user_id`, `id`)',
    );
    await queryRunner.query(
      'ALTER TABLE `user_forgot_password` CHANGE `user_id` `user_id` int NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `user_forgot_password` ADD CONSTRAINT `FK_e87f50685d51afcf4cecd428e2f` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `user_email_verification` DROP PRIMARY KEY',
    );
    await queryRunner.query(
      'ALTER TABLE `user_email_verification` ADD PRIMARY KEY (`user_id`, `id`)',
    );
    await queryRunner.query(
      'ALTER TABLE `user_email_verification` CHANGE `user_id` `user_id` int NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `user_email_verification` ADD CONSTRAINT `FK_81832c6c8b7adee780d10766860` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `user_forgot_password` DROP PRIMARY KEY',
    );
    await queryRunner.query(
      'ALTER TABLE `user_forgot_password` ADD PRIMARY KEY (`user_id`)',
    );
    await queryRunner.query(
      'ALTER TABLE `user_forgot_password` DROP COLUMN `id`',
    );
    await queryRunner.query(
      'ALTER TABLE `user_email_verification` DROP PRIMARY KEY',
    );
    await queryRunner.query(
      'ALTER TABLE `user_email_verification` ADD PRIMARY KEY (`user_id`)',
    );
    await queryRunner.query(
      'ALTER TABLE `user_email_verification` DROP COLUMN `id`',
    );
  }
}
