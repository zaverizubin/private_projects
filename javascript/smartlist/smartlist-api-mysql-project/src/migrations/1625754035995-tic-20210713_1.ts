import { MigrationInterface, QueryRunner } from 'typeorm';

export class tic2021071311625754035995 implements MigrationInterface {
  name = '2021071311625754035995';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `sms_log` (`id` int NOT NULL AUTO_INCREMENT, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `modified_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `status` varchar(255) NOT NULL, `sender` varchar(255) NOT NULL, `receiver` varchar(255) NOT NULL, `response` text NOT NULL, `uid` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `sms_log`');
  }
}
