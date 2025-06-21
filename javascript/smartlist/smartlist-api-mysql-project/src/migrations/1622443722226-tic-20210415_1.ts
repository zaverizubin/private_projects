import { MigrationInterface, QueryRunner } from 'typeorm';

export class tic2021041511622443722226 implements MigrationInterface {
  name = 'tic2021041511622443722226';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `authorized_token` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `modified_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `refresh_token_hash` varchar(255) NOT NULL, `access_token_hash` varchar(255) NOT NULL, `candidate_id` int NULL, `user_id` int NULL, UNIQUE INDEX `REL_25d6cf3861d2dfd0bf77fed90d` (`candidate_id`), UNIQUE INDEX `REL_30d3520f8d21a86e0745515d5a` (`user_id`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'ALTER TABLE `user` DROP COLUMN `access_token_created_at`',
    );
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `refresh_token`');
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `access_token`');
    await queryRunner.query(
      'ALTER TABLE `authorized_token` ADD CONSTRAINT `FK_25d6cf3861d2dfd0bf77fed90d5` FOREIGN KEY (`candidate_id`) REFERENCES `candidate`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `authorized_token` ADD CONSTRAINT `FK_30d3520f8d21a86e0745515d5ab` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `authorized_token` DROP FOREIGN KEY `FK_30d3520f8d21a86e0745515d5ab`',
    );
    await queryRunner.query(
      'ALTER TABLE `authorized_token` DROP FOREIGN KEY `FK_25d6cf3861d2dfd0bf77fed90d5`',
    );
    await queryRunner.query(
      'ALTER TABLE `user` ADD `access_token` varchar(255) NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `user` ADD `refresh_token` varchar(255) NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `user` ADD `access_token_created_at` datetime NULL',
    );
    await queryRunner.query(
      'DROP INDEX `REL_30d3520f8d21a86e0745515d5a` ON `authorized_token`',
    );
    await queryRunner.query(
      'DROP INDEX `REL_25d6cf3861d2dfd0bf77fed90d` ON `authorized_token`',
    );
    await queryRunner.query('DROP TABLE `authorized_token`');
  }
}
