import { MigrationInterface, QueryRunner } from 'typeorm';

export class tic2021031521616650757677 implements MigrationInterface {
  name = 'tic2021031521616650757677';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `email-log`');

    await queryRunner.query('DROP TABLE `user-email-invite`');
    await queryRunner.query('DROP TABLE `user-email-verification`');
    await queryRunner.query('DROP TABLE `user-forgot-password`');

    await queryRunner.query(
      'CREATE TABLE `email_log` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `modified_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `status` tinyint NOT NULL, `sender` varchar(255) NOT NULL, `receiver` varchar(255) NOT NULL, `error_log` text NULL, `message` text NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'CREATE TABLE `user_email_invite` (`id` int NOT NULL AUTO_INCREMENT, `email` varchar(255) NOT NULL, `token` varchar(255) NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `organization_id` int NOT NULL, UNIQUE INDEX `IDX_2034b7d870f1694377580bae13` (`email`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'CREATE TABLE `user_email_verification` (`user_id` int NOT NULL, `token` varchar(255) NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX `REL_81832c6c8b7adee780d1076686` (`user_id`), PRIMARY KEY (`user_id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'CREATE TABLE `user_forgot_password` (`user_id` int NOT NULL, `token` varchar(255) NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX `REL_e87f50685d51afcf4cecd428e2` (`user_id`), PRIMARY KEY (`user_id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'ALTER TABLE `user` DROP FOREIGN KEY `FK_3e103cdf85b7d6cb620b4db0f0c`',
    );
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `access_token` `access_token` varchar(255) NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `access_token_created_at` `access_token_created_at` datetime NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `organization_id` `organization_id` int NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `user` ADD CONSTRAINT `FK_3e103cdf85b7d6cb620b4db0f0c` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `user_email_invite` ADD CONSTRAINT `FK_aa162e172848e58e116103d936f` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
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
      'ALTER TABLE `user_email_invite` DROP FOREIGN KEY `FK_aa162e172848e58e116103d936f`',
    );
    await queryRunner.query(
      'ALTER TABLE `user` DROP FOREIGN KEY `FK_3e103cdf85b7d6cb620b4db0f0c`',
    );
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `organization_id` `organization_id` int NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `access_token_created_at` `access_token_created_at` datetime NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `user` CHANGE `access_token` `access_token` varchar(255) NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `user` ADD CONSTRAINT `FK_3e103cdf85b7d6cb620b4db0f0c` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'DROP INDEX `REL_e87f50685d51afcf4cecd428e2` ON `user_forgot_password`',
    );
    await queryRunner.query('DROP TABLE `user_forgot_password`');
    await queryRunner.query(
      'DROP INDEX `REL_81832c6c8b7adee780d1076686` ON `user_email_verification`',
    );
    await queryRunner.query('DROP TABLE `user_email_verification`');
    await queryRunner.query(
      'DROP INDEX `IDX_2034b7d870f1694377580bae13` ON `user_email_invite`',
    );
    await queryRunner.query('DROP TABLE `user_email_invite`');
    await queryRunner.query('DROP TABLE `email_log`');
  }
}
