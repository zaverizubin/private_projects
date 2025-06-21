import {MigrationInterface, QueryRunner} from "typeorm";

export class tic20210317111615982275275 implements MigrationInterface {
    name = 'tic20210317111615982275275'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` DROP FOREIGN KEY `FK_3e103cdf85b7d6cb620b4db0f0c`");
        await queryRunner.query("ALTER TABLE `user` CHANGE `organization_id` `organization_id` int NULL");
        await queryRunner.query("ALTER TABLE `user` ADD CONSTRAINT `FK_3e103cdf85b7d6cb620b4db0f0c` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` DROP FOREIGN KEY `FK_3e103cdf85b7d6cb620b4db0f0c`");
        await queryRunner.query("ALTER TABLE `user` CHANGE `organization_id` `organization_id` int NOT NULL");
        await queryRunner.query("ALTER TABLE `user` ADD CONSTRAINT `FK_3e103cdf85b7d6cb620b4db0f0c` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

}
