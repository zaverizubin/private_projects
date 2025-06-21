import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CandidateDocument } from 'src/schemas/candidate.schema';
import { QuestionComment, QuestionCommentDocument } from 'src/schemas/question-comment.schema';
import { QuestionDocument } from 'src/schemas/question.schema';

@Injectable()
export class QuestionCommentDocumentRepository {


    constructor(
        @InjectModel(QuestionComment.name)
        private questionCommentModel: Model<QuestionCommentDocument>,
    ) { }

    getModelInstance(): QuestionCommentDocument {
        return new this.questionCommentModel();
    }

    async findAllForCandidateAndQuestion(candidateDocument: CandidateDocument, questionDocument: QuestionDocument): Promise<QuestionCommentDocument[]> {
        return this.questionCommentModel.find({
            candidateDocument: candidateDocument,
            questionDocument: questionDocument,
        }).exec();
    }

    async getForCandidateQuestionAndUsername(candidateDocument: CandidateDocument, questionDocument: QuestionDocument, username: string): Promise<QuestionCommentDocument> {
        return this.questionCommentModel.findOne({
            candidateDocument: candidateDocument,
            questionDocument: questionDocument,
            username: username
        }).exec();
    }

    async findByCandidateAndQuestions(candidateDocument: CandidateDocument, questionDocuments: QuestionDocument[]): Promise<QuestionCommentDocument[]> {
        const objectIds: any[] = [];
        questionDocuments.forEach(questionDocument => {
            objectIds.push(questionDocument._id)
        });
        return await this.questionCommentModel.aggregate([
            {
                $match: {
                    candidateDocument: candidateDocument._id,
                    questionDocument: { $in: objectIds },
                }
            },
            {
                $lookup:
                {
                    from: "questions",
                    localField: "questionDocument",
                    foreignField: "_id",
                    as: "questionDocument"
                }
            }
        ]);
    }

    async save(questionCommentDocument: QuestionCommentDocument): Promise<QuestionCommentDocument> {
        return questionCommentDocument.save();
    }

}
