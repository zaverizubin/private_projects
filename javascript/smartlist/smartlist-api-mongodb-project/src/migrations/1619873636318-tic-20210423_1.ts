import { MigrationInterface, QueryRunner } from 'typeorm';

export class tic2021042311619873636318 implements MigrationInterface {
  name = 'tic2021042311619873636318';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `candidate_organization`');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
