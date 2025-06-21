import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AssessmentBlockDocument } from 'src/schemas/assessment-block.schema';
import { AssessmentDocument } from 'src/schemas/assessment.schema';
import { CandidateAssessmentDocument } from 'src/schemas/candidate-assessment.schema';
import { CandidateResponseScore, CandidateResponseScoreDocument } from 'src/schemas/candidate-response-score.schema';
import { CandidateDocument } from 'src/schemas/candidate.schema';
import { QuestionDocument } from 'src/schemas/question.schema';

@Injectable()
export class CandidateResponseScoreDocumentRepository {


    constructor(
        @InjectModel(CandidateResponseScore.name)
        private candidateResponseScoreModel: Model<CandidateResponseScoreDocument>,
    ) { }

    getModelInstance(): CandidateResponseScoreDocument {
        return new this.candidateResponseScoreModel();
    }


    async getForCandidateAndAssessment(candidateDocument: any, assessmentDocument: any): Promise<CandidateResponseScoreDocument[]> {
        return this.candidateResponseScoreModel
            .find({
                assessmentDocument: assessmentDocument,
                candidateDocument: candidateDocument
            })
            .exec();
    }

    async getForCandidateAndAssessmentBlock(candidateDocument: CandidateDocument,
        assessmentBlockDocument: AssessmentBlockDocument): Promise<CandidateResponseScoreDocument[]> {
        return this.candidateResponseScoreModel.find({
            assessmentBlockDocument: assessmentBlockDocument,
            candidateDocument: candidateDocument
        }).exec();
    }

    async getForCandidateAndQuestion(candidateDocument: CandidateDocument, questionDocument: QuestionDocument): Promise<CandidateResponseScoreDocument> {
        return this.candidateResponseScoreModel.findOne({
            candidateDocument: candidateDocument,
            questionDocument: questionDocument
        }).exec();
    }

    async save(candidateResponseScoreDocument: CandidateResponseScoreDocument): Promise<CandidateResponseScoreDocument> {
        return candidateResponseScoreDocument.save();
    }

    async delete(candidateResponseScoreDocument: CandidateResponseScoreDocument): Promise<CandidateResponseScoreDocument> {
        return candidateResponseScoreDocument.remove();
    }

    async getCountForCandidateAndAssessment(candidateDocument: CandidateDocument, assessmentDocument: AssessmentDocument): Promise<number> {
        return this.candidateResponseScoreModel
            .count({
                assessmentDocument: assessmentDocument,
                candidateDocument: candidateDocument
            })
            .exec();
    }


}
