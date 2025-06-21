import { MigrationInterface, QueryRunner } from 'typeorm';

export class tic202104071617712878116 implements MigrationInterface {
  name = 'tic202104071617712878116';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `assessment_block` CHANGE `sort_order` `sort_order` int NOT NULL DEFAULT '0'",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `assessment_block` CHANGE `sort_order` `sort_order` int NOT NULL',
    );
  }
}
