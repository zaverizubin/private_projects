import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { verifyMongoDBIdOrThrow } from 'src/utils/app.utils';
import { Candidate, CandidateDocument } from 'src/schemas/candidate.schema';
import { OrganizationDocument } from 'src/schemas/organization.schema';

@Injectable()
export class CandidateDocumentRepository {


    constructor(
        @InjectModel(Candidate.name)
        private candidateModel: Model<CandidateDocument>,
    ) { }

    getModelInstance(): CandidateDocument {
        return new this.candidateModel();
    }

    async save(
        candidateDocument: CandidateDocument,
    ): Promise<CandidateDocument> {
        return candidateDocument.save();
    }

    async findById(id: string): Promise<CandidateDocument> {
        verifyMongoDBIdOrThrow(id);
        return this.candidateModel.findById(id).exec();
    }


    async findAll(): Promise<CandidateDocument[]> {
        return this.candidateModel.find().exec();
    }

    async findAllByIds(candidateIds: any[]): Promise<CandidateDocument[]> {
        return this.candidateModel.find({
            '_id': {
                $in: [
                    candidateIds
                ]
            }
        }).exec();
    }

    async findByContactNumber(contact_number: string): Promise<CandidateDocument> {
        return this.candidateModel.findOne({ contact_number: contact_number }).exec();
    }

    async findByEmail(email: string): Promise<CandidateDocument> {
        return this.candidateModel.findOne({ email: email }).exec();
    }

    async findByNameForOrganization(organizationDocument: OrganizationDocument, name: string): Promise<CandidateDocument[]> {
        return this.candidateModel
            .find({ organizationDocument: organizationDocument, name: name })
            .exec();
    }

    async delete(candidateDocument: CandidateDocument) {
        return candidateDocument.remove();
    }


}
