import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import appConfig from './app.config';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => {
    return {
      type: 'mysql',
      host: appConfig().database.host,
      port: appConfig().database.port,
      username: appConfig().database.username,
      password: appConfig().database.password,
      database: appConfig().database.dbname,
      entities: [__dirname + '/../**/*.entity.{js,ts}'],
    } as TypeOrmModuleAsyncOptions;
  },
};

/*This config is used by the migration script -> npm run migration:run which is not integrated with nestjs
but instead uses the typeorm.config - migrations.ts file*/
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: appConfig().database.host,
  port: appConfig().database.port,
  username: appConfig().database.username,
  password: appConfig().database.password,
  database: appConfig().database.dbname,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  cli: {
    migrationsDir: __dirname + '/../migrations',
  },
  synchronize: false,
};
