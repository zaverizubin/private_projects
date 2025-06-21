import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CandidateAttemptLog, CandidateAttemptLogDocument } from 'src/schemas/candidate-attempt-log.schema';

@Injectable()
export class CandidateAttemptLogDocumentRepository {
    constructor(
        @InjectModel(CandidateAttemptLog.name)
        private candidateAttemptLogModel: Model<CandidateAttemptLogDocument>,
    ) { }

    getModelInstance(): CandidateAttemptLogDocument {
        return new this.candidateAttemptLogModel();
    }

    async save(
        candidateAttemptLogDocument: CandidateAttemptLogDocument,
    ): Promise<CandidateAttemptLogDocument> {
        return candidateAttemptLogDocument.save();
    }

    async delete(candidateAttemptLogDocument: CandidateAttemptLogDocument) {
        return candidateAttemptLogDocument.remove();
    }


}
