import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Organization,
  OrganizationDocument,
} from 'src/schemas/organization.schema';
import { Model } from 'mongoose';
import { verifyMongoDBIdOrThrow } from 'src/utils/app.utils';

@Injectable()
export class OrganizationDocumentRepository {
  constructor(
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>,
  ) {}

  getModelInstance(): OrganizationDocument {
    return new this.organizationModel();
  }

  async save(
    organizationDocument: OrganizationDocument,
  ): Promise<OrganizationDocument> {
    return organizationDocument.save();
  }

  async findByName(name: string): Promise<OrganizationDocument> {
    return this.organizationModel.findOne({ name: name }).exec();
  }

  async findById(id: string): Promise<OrganizationDocument> {
    verifyMongoDBIdOrThrow(id);
    return this.organizationModel.findById(id).exec();
  }

  async findAll(): Promise<OrganizationDocument[]> {
    return this.organizationModel.find().exec();
  }
}
