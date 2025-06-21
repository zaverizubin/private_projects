import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { verifyMongoDBIdOrThrow } from 'src/utils/app.utils';
import { AssetFile, AssetFileDocument } from 'src/schemas/asset-file.schema';

@Injectable()
export class AssetFileDocumentRepository {
  constructor(
    @InjectModel(AssetFile.name)
    private assetFileModel: Model<AssetFileDocument>,
  ) {}

  getModelInstance(): AssetFileDocument {
    return new this.assetFileModel();
  }

  async save(assetFileDocument: AssetFileDocument): Promise<AssetFileDocument> {
    return assetFileDocument.save();
  }

  async findByName(name: string): Promise<AssetFileDocument> {
    return this.assetFileModel.findOne({ name: name }).exec();
  }

  async findById(id: string): Promise<AssetFileDocument> {
    verifyMongoDBIdOrThrow(id);
    return this.assetFileModel.findById(id).exec();
  }
}
