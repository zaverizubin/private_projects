import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileService } from './file.service';
import { FilesController } from './file.controller';
import { CryptoService } from 'src/providers/crypto.service';
import { MongooseModule } from '@nestjs/mongoose';

import { AssetFile, AssetFileSchema } from 'src/schemas/asset-file.schema';
import { AssetFileDocumentRepository } from './file.document.repository';

@Module({
  controllers: [FilesController],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: AssetFile.name, schema: AssetFileSchema },
    ]),

  ],
  providers: [FileService, CryptoService, AssetFileDocumentRepository],
})
export class FilesModule { }
