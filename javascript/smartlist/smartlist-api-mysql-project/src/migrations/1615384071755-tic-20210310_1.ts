import { MigrationInterface, QueryRunner } from 'typeorm';

export class tic2021031011615384071755 implements MigrationInterface {
  name = 'tic2021031011615384071755';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `file` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `modified_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `original_name` varchar(255) NOT NULL COMMENT 'Original file name from the client', `name` varchar(255) NOT NULL COMMENT 'System generated filename', `size` int NOT NULL, `disk` enum ('local', 's3') NOT NULL COMMENT 'The disk used for uploading the file' DEFAULT 'local', `url` varchar(1000) NOT NULL COMMENT 'The url of the file', `mime_type` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      "CREATE TABLE `user` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `modified_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, `email` varchar(255) NOT NULL, `password` varchar(255) NOT NULL, `password_salt` varchar(255) NOT NULL, `active` tinyint NOT NULL COMMENT 'Has the user verified email' DEFAULT '0', `role` varchar(255) NULL, `department` varchar(255) NULL, `access_token` varchar(255) NOT NULL, `refresh_token` varchar(255) NULL, `access_token_created_at` datetime NOT NULL, `organization_id` int NOT NULL, UNIQUE INDEX `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`), PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      'CREATE TABLE `organization` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `modified_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, `url` varchar(1000) NULL, `contact_number` varchar(255) NULL, `about` varchar(5000) NULL, `logo_id` int NULL, UNIQUE INDEX `REL_bee3ed11f69c969bd9947e36d9` (`logo_id`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      "CREATE TABLE `assessment` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `modified_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, `position` varchar(255) NULL, `department` varchar(255) NULL, `introduction` varchar(5000) NOT NULL, `duration` int NOT NULL, `passing_score` int NOT NULL, `published` tinyint NOT NULL DEFAULT '0', `active` tinyint NOT NULL DEFAULT '0', `activated_on` datetime NOT NULL, `deactivated_on` datetime NOT NULL, `organization_id` int NOT NULL, `header_image_id` int NULL, `video_link_id` int NULL, UNIQUE INDEX `REL_79505c82742da01b4284632233` (`header_image_id`), UNIQUE INDEX `REL_f05d972c8eb7f0be663272d6cb` (`video_link_id`), PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      'CREATE TABLE `assessment_block` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `modified_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `title` varchar(255) NOT NULL, `time_interval` int NOT NULL, `sort_order` int NOT NULL, `closing_comments` varchar(5000) NULL, `assessment_id` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'CREATE TABLE `question` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `modified_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `question_type` varchar(255) NOT NULL, `introduction` varchar(5000) NULL, `text` varchar(5000) NOT NULL, `score` int NOT NULL, `video_file_id` int NULL, `assessment_block_id` int NOT NULL, UNIQUE INDEX `REL_df93ca7c0096e7d06c6fa3108d` (`video_file_id`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'CREATE TABLE `answer_option` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `modified_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `correct` tinyint NOT NULL, `text` varchar(1000) NOT NULL, `question_id` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'CREATE TABLE `candidate_response` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `modified_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `answer` varchar(5000) NOT NULL, `candidate_assessment_id` int NOT NULL, `video_file_id` int NULL, `question_id` int NOT NULL, UNIQUE INDEX `REL_43ab8fb388670030c8cacf82f6` (`video_file_id`), UNIQUE INDEX `REL_46bb7ed7d6eb9765f5ebb121ca` (`question_id`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      "CREATE TABLE `candidate` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `modified_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, `email` varchar(255) NOT NULL, `contact_number` varchar(255) NULL, `verified` tinyint NOT NULL DEFAULT '0', `verification_code` varchar(255) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      "CREATE TABLE `candidate_assessment` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `modified_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `completed` tinyint NOT NULL DEFAULT '0', `start_date` datetime NULL, `end_date` datetime NULL, `active_assessment_block_id` int NOT NULL, `candidate_id` int NOT NULL, `assessment_id` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      'CREATE TABLE `candidate_organization` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `modified_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `photo_file_id` int NULL, `video_file_id` int NULL, `candidate_id` int NOT NULL, `organization_id` int NOT NULL, UNIQUE INDEX `REL_ebfd9329dc008edb0ab70c34aa` (`photo_file_id`), UNIQUE INDEX `REL_00506294fe497ed04c12911d04` (`video_file_id`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'CREATE TABLE `user-email-invite` (`id` int NOT NULL AUTO_INCREMENT, `email` varchar(255) NOT NULL, `token` varchar(255) NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `organization_id` int NOT NULL, UNIQUE INDEX `IDX_be792cce5fcef37a2d9901c4a5` (`email`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'CREATE TABLE `user-email-verification` (`user_id` int NOT NULL, `token` varchar(255) NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX `REL_97155b90b80a2f9c522df536ac` (`user_id`), PRIMARY KEY (`user_id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'CREATE TABLE `user-forgot-password` (`user_id` int NOT NULL, `token` varchar(255) NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX `REL_256dd78fabdd3846b0dd95f055` (`user_id`), PRIMARY KEY (`user_id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'ALTER TABLE `user` ADD CONSTRAINT `FK_3e103cdf85b7d6cb620b4db0f0c` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `organization` ADD CONSTRAINT `FK_bee3ed11f69c969bd9947e36d9a` FOREIGN KEY (`logo_id`) REFERENCES `file`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `assessment` ADD CONSTRAINT `FK_2f8bded1b93538471b579aa43c7` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `assessment` ADD CONSTRAINT `FK_79505c82742da01b42846322338` FOREIGN KEY (`header_image_id`) REFERENCES `file`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `assessment` ADD CONSTRAINT `FK_f05d972c8eb7f0be663272d6cb4` FOREIGN KEY (`video_link_id`) REFERENCES `file`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `assessment_block` ADD CONSTRAINT `FK_7f684886e100ddd547bd3e0b432` FOREIGN KEY (`assessment_id`) REFERENCES `assessment`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `question` ADD CONSTRAINT `FK_df93ca7c0096e7d06c6fa3108d0` FOREIGN KEY (`video_file_id`) REFERENCES `file`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `question` ADD CONSTRAINT `FK_88a3724719d58ac01a71f802215` FOREIGN KEY (`assessment_block_id`) REFERENCES `assessment_block`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `answer_option` ADD CONSTRAINT `FK_c8ff81963b1cf29c3e4188e5ba4` FOREIGN KEY (`question_id`) REFERENCES `question`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_response` ADD CONSTRAINT `FK_0218a63601433720e7c4435352a` FOREIGN KEY (`candidate_assessment_id`) REFERENCES `candidate_assessment`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_response` ADD CONSTRAINT `FK_43ab8fb388670030c8cacf82f68` FOREIGN KEY (`video_file_id`) REFERENCES `file`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_response` ADD CONSTRAINT `FK_46bb7ed7d6eb9765f5ebb121caf` FOREIGN KEY (`question_id`) REFERENCES `question`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_assessment` ADD CONSTRAINT `FK_92fd207f4ef03e7b0c2f6e373b3` FOREIGN KEY (`active_assessment_block_id`) REFERENCES `assessment_block`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_assessment` ADD CONSTRAINT `FK_23912a55afb6de31f62f1aad1d8` FOREIGN KEY (`candidate_id`) REFERENCES `candidate`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_assessment` ADD CONSTRAINT `FK_71d224ff228817b64ea5f06feb0` FOREIGN KEY (`assessment_id`) REFERENCES `assessment`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_organization` ADD CONSTRAINT `FK_ebfd9329dc008edb0ab70c34aad` FOREIGN KEY (`photo_file_id`) REFERENCES `file`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_organization` ADD CONSTRAINT `FK_00506294fe497ed04c12911d040` FOREIGN KEY (`video_file_id`) REFERENCES `file`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_organization` ADD CONSTRAINT `FK_52700009aff1aa1ce1f72dc491d` FOREIGN KEY (`candidate_id`) REFERENCES `candidate`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_organization` ADD CONSTRAINT `FK_22360859023c920fd57195736ba` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `user-email-invite` ADD CONSTRAINT `FK_3bc5c61cb2a400d446a4013716d` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `user-email-verification` ADD CONSTRAINT `FK_97155b90b80a2f9c522df536acd` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `user-forgot-password` ADD CONSTRAINT `FK_256dd78fabdd3846b0dd95f0558` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user-forgot-password` DROP FOREIGN KEY `FK_256dd78fabdd3846b0dd95f0558`',
    );
    await queryRunner.query(
      'ALTER TABLE `user-email-verification` DROP FOREIGN KEY `FK_97155b90b80a2f9c522df536acd`',
    );
    await queryRunner.query(
      'ALTER TABLE `user-email-invite` DROP FOREIGN KEY `FK_3bc5c61cb2a400d446a4013716d`',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_organization` DROP FOREIGN KEY `FK_22360859023c920fd57195736ba`',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_organization` DROP FOREIGN KEY `FK_52700009aff1aa1ce1f72dc491d`',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_organization` DROP FOREIGN KEY `FK_00506294fe497ed04c12911d040`',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_organization` DROP FOREIGN KEY `FK_ebfd9329dc008edb0ab70c34aad`',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_assessment` DROP FOREIGN KEY `FK_71d224ff228817b64ea5f06feb0`',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_assessment` DROP FOREIGN KEY `FK_23912a55afb6de31f62f1aad1d8`',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_assessment` DROP FOREIGN KEY `FK_92fd207f4ef03e7b0c2f6e373b3`',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_response` DROP FOREIGN KEY `FK_46bb7ed7d6eb9765f5ebb121caf`',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_response` DROP FOREIGN KEY `FK_43ab8fb388670030c8cacf82f68`',
    );
    await queryRunner.query(
      'ALTER TABLE `candidate_response` DROP FOREIGN KEY `FK_0218a63601433720e7c4435352a`',
    );
    await queryRunner.query(
      'ALTER TABLE `answer_option` DROP FOREIGN KEY `FK_c8ff81963b1cf29c3e4188e5ba4`',
    );
    await queryRunner.query(
      'ALTER TABLE `question` DROP FOREIGN KEY `FK_88a3724719d58ac01a71f802215`',
    );
    await queryRunner.query(
      'ALTER TABLE `question` DROP FOREIGN KEY `FK_df93ca7c0096e7d06c6fa3108d0`',
    );
    await queryRunner.query(
      'ALTER TABLE `assessment_block` DROP FOREIGN KEY `FK_7f684886e100ddd547bd3e0b432`',
    );
    await queryRunner.query(
      'ALTER TABLE `assessment` DROP FOREIGN KEY `FK_f05d972c8eb7f0be663272d6cb4`',
    );
    await queryRunner.query(
      'ALTER TABLE `assessment` DROP FOREIGN KEY `FK_79505c82742da01b42846322338`',
    );
    await queryRunner.query(
      'ALTER TABLE `assessment` DROP FOREIGN KEY `FK_2f8bded1b93538471b579aa43c7`',
    );
    await queryRunner.query(
      'ALTER TABLE `organization` DROP FOREIGN KEY `FK_bee3ed11f69c969bd9947e36d9a`',
    );
    await queryRunner.query(
      'ALTER TABLE `user` DROP FOREIGN KEY `FK_3e103cdf85b7d6cb620b4db0f0c`',
    );
    await queryRunner.query(
      'DROP INDEX `REL_256dd78fabdd3846b0dd95f055` ON `user-forgot-password`',
    );
    await queryRunner.query('DROP TABLE `user-forgot-password`');
    await queryRunner.query(
      'DROP INDEX `REL_97155b90b80a2f9c522df536ac` ON `user-email-verification`',
    );
    await queryRunner.query('DROP TABLE `user-email-verification`');
    await queryRunner.query(
      'DROP INDEX `IDX_be792cce5fcef37a2d9901c4a5` ON `user-email-invite`',
    );
    await queryRunner.query('DROP TABLE `user-email-invite`');
    await queryRunner.query(
      'DROP INDEX `REL_00506294fe497ed04c12911d04` ON `candidate_organization`',
    );
    await queryRunner.query(
      'DROP INDEX `REL_ebfd9329dc008edb0ab70c34aa` ON `candidate_organization`',
    );
    await queryRunner.query('DROP TABLE `candidate_organization`');
    await queryRunner.query('DROP TABLE `candidate_assessment`');
    await queryRunner.query('DROP TABLE `candidate`');
    await queryRunner.query(
      'DROP INDEX `REL_46bb7ed7d6eb9765f5ebb121ca` ON `candidate_response`',
    );
    await queryRunner.query(
      'DROP INDEX `REL_43ab8fb388670030c8cacf82f6` ON `candidate_response`',
    );
    await queryRunner.query('DROP TABLE `candidate_response`');
    await queryRunner.query('DROP TABLE `answer_option`');
    await queryRunner.query(
      'DROP INDEX `REL_df93ca7c0096e7d06c6fa3108d` ON `question`',
    );
    await queryRunner.query('DROP TABLE `question`');
    await queryRunner.query('DROP TABLE `assessment_block`');
    await queryRunner.query(
      'DROP INDEX `REL_f05d972c8eb7f0be663272d6cb` ON `assessment`',
    );
    await queryRunner.query(
      'DROP INDEX `REL_79505c82742da01b4284632233` ON `assessment`',
    );
    await queryRunner.query('DROP TABLE `assessment`');
    await queryRunner.query(
      'DROP INDEX `REL_bee3ed11f69c969bd9947e36d9` ON `organization`',
    );
    await queryRunner.query('DROP TABLE `organization`');
    await queryRunner.query(
      'DROP INDEX `IDX_e12875dfb3b1d92d7d7c5377e2` ON `user`',
    );
    await queryRunner.query('DROP TABLE `user`');
    await queryRunner.query('DROP TABLE `file`');
  }
}
