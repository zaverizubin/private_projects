import { MigrationInterface, QueryRunner } from 'typeorm';

export class tic202104061617631218193 implements MigrationInterface {
  name = 'tic202104061617631218193';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `assessment` CHANGE `activated_on` `activated_on` datetime NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `assessment` CHANGE `deactivated_on` `deactivated_on` datetime NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `assessment` CHANGE `deactivated_on` `deactivated_on` datetime NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE `assessment` CHANGE `activated_on` `activated_on` datetime NOT NULL',
    );
  }
}
