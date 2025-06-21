import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { verifyMongoDBIdOrThrow } from 'src/utils/app.utils';
import { Question, QuestionDocument } from 'src/schemas/question.schema';
import { AssessmentBlockDocument } from 'src/schemas/assessment-block.schema';
import { AssessmentDocument } from 'src/schemas/assessment.schema';
import { AnswerOptionDocument } from 'src/schemas/answer-option.schema';

@Injectable()
export class QuestionDocumentRepository {

  constructor(
    @InjectModel(Question.name)
    private questionModel: Model<QuestionDocument>,
  ) { }

  getModelInstance(): QuestionDocument {
    return new this.questionModel();
  }

  async save(questionDocument: QuestionDocument): Promise<QuestionDocument> {
    return questionDocument.save();
  }

  async saveAll(questionDocuments: QuestionDocument[]) {
    const sess = await this.questionModel.startSession();

    sess.startTransaction();
    try {
      questionDocuments.map(async (questionDocument) => {
        await questionDocument.save({ session: sess });
      }),
        await sess.commitTransaction();
    } catch (ex) {
      await sess.abortTransaction();
    } finally {
      sess.endSession();
    }
  }

  async findById(id: string): Promise<QuestionDocument> {
    verifyMongoDBIdOrThrow(id);
    return this.questionModel.findById(id).exec();
  }

  async getMaxSortOrder(
    assessmentBlockDocument: AssessmentBlockDocument,
  ): Promise<number> {
    const questionDocuments: QuestionDocument[] = await this.questionModel
      .find({ assessmentBlockDocument: assessmentBlockDocument })
      .sort({ sort_order: -1 })
      .limit(1)
      .select('sort_order');
    return questionDocuments.length > 0
      ? questionDocuments[0].sort_order
      : null;
  }

  async getCountForAssessmentBlock(
    assessmentBlockDocument: AssessmentBlockDocument,
  ): Promise<number> {
    return this.questionModel
      .find({ assessmentBlockDocument: assessmentBlockDocument })
      .count()
      .exec();
  }

  async getCountForAssessmentBlocks(
    assessmentBlockDocuments: AssessmentBlockDocument[],
  ): Promise<number> {
    return this.questionModel
      .find({ assessmentBlockDocument: { $in: assessmentBlockDocuments } })
      .count()
      .exec();
  }

  async findAllForAssessmentBlocks(assessmentBlockDocuments: AssessmentBlockDocument[]): Promise<QuestionDocument[]> {
    return this.questionModel
      .find({ assessmentBlockDocument: { $in: assessmentBlockDocuments } })
  }

  async findAllForAssessmentBlock(
    assessmentBlockDocument: AssessmentBlockDocument,
  ): Promise<QuestionDocument[]> {
    return this.questionModel
      .find({ assessmentBlockDocument: assessmentBlockDocument })
      .sort({ sort_order: 1 })
      .exec();
  }

  async updateSortOrder(
    sort_order: number,
    assessmentBlockDocument: AssessmentBlockDocument,
  ) {
    await this.questionModel.updateMany(
      {
        sort_order: { $gt: sort_order },
        assessmentBlockDocument: assessmentBlockDocument,
      },
      { $inc: { sort_order: -1 } },
    );
  }

  async delete(questionDocument: QuestionDocument): Promise<QuestionDocument> {
    return questionDocument.remove();
  }

  findAnswerOptionById(questionDocument: QuestionDocument, id: string): AnswerOptionDocument {
    for (var i = 0; i < questionDocument.answerOptionDocuments.length; i++) {
      if (questionDocument.answerOptionDocuments[i]._id.toString() == id) {
        return questionDocument.answerOptionDocuments[i];
      }
    }
    return null;
  }
}
