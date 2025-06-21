import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { verifyMongoDBIdOrThrow } from 'src/utils/app.utils';
import { CandidateAssessment, CandidateAssessmentDocument } from 'src/schemas/candidate-assessment.schema';
import { CandidateDocument } from 'src/schemas/candidate.schema';
import { AssessmentDocument } from 'src/schemas/assessment.schema';
import { CandidateResponseDocument } from 'src/schemas/candidate-response.schema';
import { QuestionDocument } from 'src/schemas/question.schema';
import { CandidateAssessmentStatus } from 'src/enums/candidate.assessment.status';

@Injectable()
export class CandidateAssessmentDocumentRepository {

    constructor(
        @InjectModel(CandidateAssessment.name)
        private candidateAssessmentModel: Model<CandidateAssessmentDocument>,
    ) { }

    getModelInstance(): CandidateAssessmentDocument {
        return new this.candidateAssessmentModel();
    }

    async save(
        candidateAssessmentDocument: CandidateAssessmentDocument,
    ): Promise<CandidateAssessmentDocument> {
        return candidateAssessmentDocument.save();
    }

    async findByCandidate(candidateDocument: CandidateDocument): Promise<CandidateAssessmentDocument> {
        return this.candidateAssessmentModel.findOne({
            candidateDocument: candidateDocument,
        }).exec();
    }

    async findAllForAssessment(assessmentDocument: AssessmentDocument): Promise<CandidateAssessmentDocument[]> {
        return this.candidateAssessmentModel.find({
            assessmentDocument: assessmentDocument,
        }).exec();
    }

    async findAllForAssessmentAndStatus(assessmentDocument: AssessmentDocument, status: CandidateAssessmentStatus): Promise<CandidateAssessmentDocument[]> {
        return this.candidateAssessmentModel.find({
            assessmentDocument: assessmentDocument,
            status: status,
        }).exec();
    }

    async findAllForAssessments(assessmentDocuments: AssessmentDocument[]): Promise<CandidateAssessmentDocument[]> {
        return this.candidateAssessmentModel.find({
            assessmentDocument: { $in: assessmentDocuments },
        }).exec();
    }

    async findByCandidateAndAssessment(candidateDocument: CandidateDocument,
        assessmentDocument: AssessmentDocument): Promise<CandidateAssessmentDocument> {
        return this.candidateAssessmentModel.findOne({
            candidateDocument: candidateDocument,
            assessmentDocument: assessmentDocument,
        }).exec();
    }

    async findById(id: string): Promise<CandidateAssessmentDocument> {
        verifyMongoDBIdOrThrow(id);
        return this.candidateAssessmentModel.findById(id).exec();
    }

    async delete(candidateAssessmentDocument: CandidateAssessmentDocument) {
        return candidateAssessmentDocument.remove();
    }

    async getCountOfCompletedAssessments(assessmentDocument: AssessmentDocument): Promise<number> {
        return this.candidateAssessmentModel.find({
            assessmentDocument: assessmentDocument,
            end_date: { $ne: null },
        }).count();
    }


    findResponsesByCandidateAssessmentAndQuestion(candidateAssessmentDocument: CandidateAssessmentDocument,
        questionDocument: QuestionDocument): CandidateResponseDocument[] {
        let candidateResponseDocuments: CandidateResponseDocument[] = [];

        candidateAssessmentDocument.candidateResponseDocuments.forEach(candidateResponseDocument => {
            if (candidateResponseDocument.questionDocument.toString() == questionDocument.id) {
                candidateResponseDocuments.push(candidateResponseDocument);
            }
        });
        return candidateResponseDocuments;
    }


    deleteResponseForCandidateAssessmentAndQuestion(candidateAssessmentDocument: CandidateAssessmentDocument, questionDocument: QuestionDocument) {
        candidateAssessmentDocument.candidateResponseDocuments.forEach((crd, index) => {
            if (crd.questionDocument.toString() == questionDocument.id) {
                candidateAssessmentDocument.candidateResponseDocuments.splice(index, 1);
            }
        });
    }

}
