import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { verifyMongoDBIdOrThrow } from 'src/utils/app.utils';
import { CandidateResponse, CandidateResponseDocument } from 'src/schemas/candidate-response.schema';
import { CandidateAssessmentDocument } from 'src/schemas/candidate-assessment.schema';
import { QuestionDocument } from 'src/schemas/question.schema';

@Injectable()
export class CandidateResponseDocumentRepository {
    constructor(
        @InjectModel(CandidateResponse.name)
        private candidateResponseModel: Model<CandidateResponseDocument>,
    ) { }

    getModelInstance(): CandidateResponseDocument {
        return new this.candidateResponseModel();
    }




}
