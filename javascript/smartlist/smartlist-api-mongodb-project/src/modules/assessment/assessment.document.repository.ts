import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Assessment, AssessmentDocument } from 'src/schemas/assessment.schema';
import { verifyMongoDBIdOrThrow } from 'src/utils/app.utils';
import { OrganizationDocument } from 'src/schemas/organization.schema';
import { AssessmentStatus } from 'src/enums/assessment.status';

@Injectable()
export class AssessmentDocumentRepository {
  constructor(
    @InjectModel(Assessment.name)
    private assessmentModel: Model<AssessmentDocument>,
  ) { }

  getModelInstance(): AssessmentDocument {
    return new this.assessmentModel();
  }

  async save(
    assessmentDocument: AssessmentDocument,
  ): Promise<AssessmentDocument> {
    return assessmentDocument.save();
  }

  async findByName(name: string): Promise<AssessmentDocument> {
    return this.assessmentModel.findOne({ name: name }).exec();
  }

  async findByToken(token: string): Promise<AssessmentDocument> {
    return this.assessmentModel.findOne({ token: token }).exec();
  }

  async findById(id: string): Promise<AssessmentDocument> {
    verifyMongoDBIdOrThrow(id);
    return this.assessmentModel.findById(id).exec();
  }

  async findByNameAndOrganization(
    name: string,
    organization: OrganizationDocument,
  ): Promise<AssessmentDocument> {
    return this.assessmentModel
      .findOne({ name: name, organizationDocument: organization })
      .exec();
  }

  async findByOrganization(
    organization: OrganizationDocument,
  ): Promise<AssessmentDocument[]> {
    return this.assessmentModel.find({ organizationDocument: organization }).exec();
  }

  async findByOrganizationAndStatus(
    organization: OrganizationDocument,
    status: AssessmentStatus,
  ): Promise<AssessmentDocument[]> {
    return this.assessmentModel
      .find({ status: status, organizationDocument: organization })
      .exec();
  }

  async findByStatusAndNameForOrganization(
    organization: OrganizationDocument,
    status: AssessmentStatus,
    name: string,
  ): Promise<AssessmentDocument> {
    return this.assessmentModel
      .findOne({ name: name, status: status, organizationDocument: organization })
      .exec();
  }

  async findAll(): Promise<AssessmentDocument[]> {
    return this.assessmentModel.find().exec();
  }

  async delete(assessmentDocument: AssessmentDocument) {
    return assessmentDocument.remove();
  }
}
