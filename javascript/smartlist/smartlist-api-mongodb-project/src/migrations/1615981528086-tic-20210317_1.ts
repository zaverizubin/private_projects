import {MigrationInterface, QueryRunner} from "typeorm";

export class tic2021031711615981528086 implements MigrationInterface {
    name = 'tic2021031711615981528086'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` CHANGE `access_token_created_at` `access_token_created_at` datetime NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` CHANGE `access_token_created_at` `access_token_created_at` datetime NOT NULL");
    }

}
