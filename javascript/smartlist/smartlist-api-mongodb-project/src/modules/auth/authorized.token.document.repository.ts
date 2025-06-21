import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { verifyMongoDBIdOrThrow } from 'src/utils/app.utils';
import { CandidateAssessment, CandidateAssessmentDocument } from 'src/schemas/candidate-assessment.schema';
import { CandidateDocument } from 'src/schemas/candidate.schema';
import { AssessmentDocument } from 'src/schemas/assessment.schema';
import { AuthorizedToken, AuthorizedTokenDocument } from 'src/schemas/authorized-token.schema';
import { UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class AuthorizedTokenDocumentRepository {

    constructor(
        @InjectModel(AuthorizedToken.name)
        private authorizedTokenModel: Model<AuthorizedTokenDocument>,
    ) { }

    getModelInstance(): AuthorizedTokenDocument {
        return new this.authorizedTokenModel();
    }

    async findByAccessToken(accessTokenHash: string): Promise<AuthorizedTokenDocument> {
        return this.authorizedTokenModel.findOne({
            access_token_hash: accessTokenHash,
        }).exec();
    }

    async findByUser(userDocument: UserDocument): Promise<AuthorizedTokenDocument> {
        return this.authorizedTokenModel.findOne({
            userDocument: userDocument,
        }).exec();
    }

    async findByCandidate(candidateDocument: CandidateDocument): Promise<AuthorizedTokenDocument> {
        return this.authorizedTokenModel.findOne({
            candidateDocument: candidateDocument,
        }).exec();
    }

    async delete(authorizedTokenDocument: AuthorizedTokenDocument) {
        authorizedTokenDocument.deleteOne();
    }

    async save(
        authorizedTokenDocument: AuthorizedTokenDocument,
    ): Promise<AuthorizedTokenDocument> {
        return authorizedTokenDocument.save();
    }



}
