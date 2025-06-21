import { MigrationInterface, QueryRunner } from 'typeorm';

export class tic2021031611615981781216 implements MigrationInterface {
  name = 'tic2021031611615981781216';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `email-log` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `modified_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `status` tinyint NOT NULL, `sender` varchar(255) NOT NULL, `receiver` varchar(255) NOT NULL, `error_log` text NULL, `message` text NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `email-log`');
  }
}
