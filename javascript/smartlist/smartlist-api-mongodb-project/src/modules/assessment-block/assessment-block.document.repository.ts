import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { verifyMongoDBIdOrThrow } from 'src/utils/app.utils';
import {
  AssessmentBlock,
  AssessmentBlockDocument,
} from 'src/schemas/assessment-block.schema';
import { AssessmentDocument } from 'src/schemas/assessment.schema';

@Injectable()
export class AssessmentBlockDocumentRepository {

  constructor(
    @InjectModel(AssessmentBlock.name)
    private assessmentBlockModel: Model<AssessmentBlockDocument>,
  ) { }

  getModelInstance(): AssessmentBlockDocument {
    return new this.assessmentBlockModel();
  }

  async save(
    assessmentBlockDocument: AssessmentBlockDocument,
  ): Promise<AssessmentBlockDocument> {
    return assessmentBlockDocument.save();
  }

  async saveAll(assessmentBlockDocuments: AssessmentBlockDocument[]) {
    const sess = await this.assessmentBlockModel.startSession();

    sess.startTransaction();
    try {
      assessmentBlockDocuments.map(async (assessmentBlockDocument) => {
        await assessmentBlockDocument.save({ session: sess });
      }),
        await sess.commitTransaction();
    } catch (ex) {
      await sess.abortTransaction();
    } finally {
      sess.endSession();
    }
  }

  async findById(id: string): Promise<AssessmentBlockDocument> {
    verifyMongoDBIdOrThrow(id);
    return this.assessmentBlockModel.findById(id).exec();
  }

  async findByIds(ids: string[]): Promise<AssessmentBlockDocument[]> {
    const objectIds: any[] = [];
    ids.forEach(id => {
      objectIds.push(mongoose.Types.ObjectId(id))
    });
    return this.assessmentBlockModel.find(
      { _id: { $in: ids } }
    )
  }

  async findAllForAssessment(
    assessmentDocument: AssessmentDocument,
  ): Promise<AssessmentBlockDocument[]> {
    return this.assessmentBlockModel
      .find({ assessmentDocument: assessmentDocument })
      .exec();
  }

  async getCountForAssessment(
    assessmentDocument: AssessmentDocument,
  ): Promise<number> {
    return this.assessmentBlockModel
      .find({ assessmentDocument: assessmentDocument })
      .count()
      .exec();
  }

  async delete(assessmentBlockDocument: AssessmentBlockDocument) {
    return assessmentBlockDocument.remove();
  }

  async updateSortOrder(
    sort_order: number,
    assessmentDocument: AssessmentDocument,
  ) {
    await this.assessmentBlockModel.updateMany(
      {
        sort_order: { $gt: sort_order },
        assessmentDocument: assessmentDocument,
      },
      { $inc: { sort_order: -1 } },
    );
  }
}
