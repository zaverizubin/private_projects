import {MigrationInterface, QueryRunner} from "typeorm";

export class tic2021040511617612698145 implements MigrationInterface {
    name = 'tic2021040511617612698145'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `question` DROP FOREIGN KEY `FK_df93ca7c0096e7d06c6fa3108d0`");
        await queryRunner.query("DROP INDEX `REL_df93ca7c0096e7d06c6fa3108d` ON `question`");
        await queryRunner.query("ALTER TABLE `assessment` DROP COLUMN `duration`");
        await queryRunner.query("ALTER TABLE `assessment` DROP COLUMN `passing_score`");
        await queryRunner.query("ALTER TABLE `assessment_block` DROP COLUMN `time_interval`");
        await queryRunner.query("ALTER TABLE `question` DROP COLUMN `question_type`");
        await queryRunner.query("ALTER TABLE `question` DROP COLUMN `introduction`");
        await queryRunner.query("ALTER TABLE `question` DROP COLUMN `video_file_id`");
        await queryRunner.query("ALTER TABLE `assessment_block` ADD `instruction` varchar(5000) NOT NULL");
        await queryRunner.query("ALTER TABLE `assessment_block` ADD `duration` int NOT NULL");
        await queryRunner.query("ALTER TABLE `question` ADD `type` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `question` ADD `sort_order` int NOT NULL");
        await queryRunner.query("ALTER TABLE `assessment` CHANGE `introduction` `introduction` varchar(5000) NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `assessment` CHANGE `introduction` `introduction` varchar(5000) NOT NULL");
        await queryRunner.query("ALTER TABLE `question` DROP COLUMN `sort_order`");
        await queryRunner.query("ALTER TABLE `question` DROP COLUMN `type`");
        await queryRunner.query("ALTER TABLE `assessment_block` DROP COLUMN `duration`");
        await queryRunner.query("ALTER TABLE `assessment_block` DROP COLUMN `instruction`");
        await queryRunner.query("ALTER TABLE `question` ADD `video_file_id` int NULL");
        await queryRunner.query("ALTER TABLE `question` ADD `introduction` varchar(5000) NULL");
        await queryRunner.query("ALTER TABLE `question` ADD `question_type` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `assessment_block` ADD `time_interval` int NOT NULL");
        await queryRunner.query("ALTER TABLE `assessment` ADD `passing_score` int NOT NULL");
        await queryRunner.query("ALTER TABLE `assessment` ADD `duration` int NOT NULL");
        await queryRunner.query("CREATE UNIQUE INDEX `REL_df93ca7c0096e7d06c6fa3108d` ON `question` (`video_file_id`)");
        await queryRunner.query("ALTER TABLE `question` ADD CONSTRAINT `FK_df93ca7c0096e7d06c6fa3108d0` FOREIGN KEY (`video_file_id`) REFERENCES `file`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

}
