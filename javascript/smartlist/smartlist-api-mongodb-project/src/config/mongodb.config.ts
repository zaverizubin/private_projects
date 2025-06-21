import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  MongooseModuleAsyncOptions,
  MongooseModuleOptions,
} from '@nestjs/mongoose';

import appConfig from './app.config';

export const mongooseAsyncConfig: MongooseModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  /*useFactory: async (configService: ConfigService) => ({
    uri: 'mongodb+srv://m001-student:lemmein@zubintestcluster.hyacc.mongodb.net/sample_airbnb?retryWrites=true&w=majority',
  }),*/
  useFactory: async (
    configService: ConfigService,
  ): Promise<MongooseModuleOptions> => {
    return {
      uri: appConfig().mongoDb.host,
      user: appConfig().mongoDb.username,
      pass: appConfig().mongoDb.password,
      dbName: appConfig().mongoDb.dbname,
      autoIndex: false, // Don't build indexes
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
    } as MongooseModuleAsyncOptions;
  },
};

