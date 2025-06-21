import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileRepository } from './file.repository';
import { FileService } from './file.service';
import { FilesController } from './file.controller';
import { CryptoService } from 'src/providers/crypto.service';

@Module({
  controllers: [FilesController],
  imports: [ConfigModule, TypeOrmModule.forFeature([FileRepository])],
  providers: [FileService, CryptoService],
})
export class FilesModule {}
