import { HttpException, HttpStatus } from '@nestjs/common';
import {
  ConnectionOptions,
  Connection,
  ConnectionManager,
  getConnectionManager,
  createConnection,
} from 'typeorm';
import { ConfigService } from '@nestjs/config';
import appConfig from '../config/app.config';

export default class DBConnectionService {
  private connectionManager: ConnectionManager;

  constructor(private readonly configService: ConfigService) {
    this.connectionManager = getConnectionManager();
  }

  async createConnectionAsync(options: ConnectionOptions): Promise<Connection> {
    let connection: Connection;
    if (!options.name) {
      throw new HttpException(
        'Connection name missing',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    if (this.connectionManager.has(options.name)) {
      connection = this.connectionManager.get(options.name);
      if (!connection.isConnected) await connection.connect();
    } else {
      connection = await createConnection(options);
    }
    return connection;
  }

  async getConnection(): Promise<Connection> {
    const connection: Connection = await this.createConnectionAsync({
      type: 'mysql',
      name: 'dbConnection',
      host: appConfig().database.host,
      port: appConfig().database.port,
      username: appConfig().database.username,
      password: appConfig().database.password,
      database: appConfig().database.dbname,
      entities: [__dirname + '/../**/*.entity.{js,ts}'],
      logging: true,
      logger: 'advanced-console',
    });
    return connection;
  }
}
