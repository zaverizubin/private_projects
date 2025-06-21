import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AssessmentDecision } from 'src/enums/assessment.decision';
import { AssessmentStatus } from 'src/enums/assessment.status';
import { CandidateAssessmentStatus } from 'src/enums/candidate.assessment.status';
import { AssessmentBlockDocument } from 'src/schemas/assessment-block.schema';
import { AssessmentDocument } from 'src/schemas/assessment.schema';
import { CandidateAssessment, CandidateAssessmentDocument } from 'src/schemas/candidate-assessment.schema';
import { CandidateAttemptLog, CandidateAttemptLogDocument } from 'src/schemas/candidate-attempt-log.schema';
import { CandidateResponseScore, CandidateResponseScoreDocument } from 'src/schemas/candidate-response-score.schema';
import { CandidateDocument } from 'src/schemas/candidate.schema';
import { OrganizationDocument } from 'src/schemas/organization.schema';
import { Question, QuestionDocument } from 'src/schemas/question.schema';
import { AssessmentBlockDocumentRepository } from '../assessment-block/assessment-block.document.repository';
import { AssessmentBlockResponseCodes } from '../assessment-block/assessment-block.response.codes';
import { AssessmentDocumentRepository } from '../assessment/assessment.document.repository';
import { AssessmentResponseCodes } from '../assessment/assessment.response.codes';
import { CandidateAssessmentDocumentRepository } from '../candidate/candidate-assessment.document.repository';
import { CandidateDocumentRepository } from '../candidate/candidate.document.repository';
import { CandidateResponseCodes } from '../candidate/candidate.response.codes';
import { OrganizationDocumentRepository } from '../organization/organization.document.repository';
import { OrganizationResponseCodes } from '../organization/organization.response.codes';

@Injectable()
export class ReportDocumentRepository {

    constructor(
        @InjectModel(CandidateAssessment.name)
        private candidateAssessmentModel: Model<CandidateAssessmentDocument>,
        @InjectModel(CandidateResponseScore.name)
        private candidateResponseScoreModel: Model<CandidateResponseScoreDocument>,
        @InjectModel(CandidateAttemptLog.name)
        private candidateAttemptLogModel: Model<CandidateAttemptLogDocument>,
        @InjectModel(Question.name)
        private questionModel: Model<QuestionDocument>,

        private candidateAssessmentDocumentRepository: CandidateAssessmentDocumentRepository,
        private organizationDocumentRepository: OrganizationDocumentRepository,
        private assessmentDocumentRepository: AssessmentDocumentRepository,
        private assessmentBlockDocumentRepository: AssessmentBlockDocumentRepository,
        private candidateDocumentRepository: CandidateDocumentRepository,
    ) { }


    async getCountCompleted(
        organizationId: string,
        assessmentId: string,
        from: Date,
        to: Date,
    ): Promise<number> {
        if (assessmentId != null) {
            const assessmentDocument: AssessmentDocument = await this.findAssessmentOrThrow(assessmentId);
            return await this.candidateAssessmentModel.countDocuments({
                end_date: { $gte: from, $lte: to },
                assessmentDocument: assessmentDocument,
            });
        } else if (organizationId != null) {
            const organizationDocument: OrganizationDocument = await this.findOrganizationOrThrow(organizationId);
            const assessmentDocuments: AssessmentDocument[] = await this.assessmentDocumentRepository.findByOrganization(organizationDocument);
            return await this.candidateAssessmentModel.countDocuments({
                end_date: { $gte: from, $lte: to },
                assessmentDocument: { $in: assessmentDocuments },
            });
        }

    }

    async getCountAttempted(
        organizationId: string,
        assessmentId: string,
        from: Date,
        to: Date,
    ): Promise<number> {
        if (assessmentId != null) {
            const assessmentDocument: AssessmentDocument = await this.findAssessmentOrThrow(assessmentId);
            return await this.candidateAssessmentModel.countDocuments({
                start_date: { $gte: from, $lte: to },
                assessmentDocument: assessmentDocument,
            });
        } else if (organizationId != null) {
            const organizationDocument: OrganizationDocument = await this.findOrganizationOrThrow(organizationId);
            const assessmentDocuments: AssessmentDocument[] = await this.assessmentDocumentRepository.findByOrganization(organizationDocument);
            return await this.candidateAssessmentModel.countDocuments({
                start_date: { $gte: from, $lte: to },
                assessmentDocument: { $in: assessmentDocuments },
            });
        }
    }

    async getCountRegistered(
        organizationId: string,
        assessmentId: string,
    ): Promise<number> {
        if (assessmentId != null) {
            const assessmentDocument: AssessmentDocument = await this.findAssessmentOrThrow(assessmentId);
            return await this.candidateAssessmentModel.countDocuments({
                assessmentDocument: assessmentDocument,
            });
        } else if (organizationId != null) {
            const organizationDocument: OrganizationDocument = await this.findOrganizationOrThrow(organizationId);
            const assessmentDocuments: AssessmentDocument[] = await this.assessmentDocumentRepository.findByOrganization(organizationDocument);
            return await this.candidateAssessmentModel.countDocuments({
                assessmentDocument: { $in: assessmentDocuments },
            });
        }
    }

    async getTimeSeriesCountRegisteredByDate(
        organizationId: string,
        assessmentId: string,
        from: Date,
        to: Date,
    ): Promise<any> {
        if (assessmentId != null) {
            const assessmentDocument: AssessmentDocument = await this.findAssessmentOrThrow(assessmentId);
            return await this.candidateAssessmentModel.aggregate([
                {
                    $match: {
                        assessmentDocument: assessmentDocument._id,
                        start_date: { $gte: from, $lte: to },
                    }
                },
                {
                    $group: { _id: "$start_date", count: { $count: {} } }
                },
                {
                    $project: {
                        _id: 0,
                        date: "$_id",
                        count: 1,
                    }
                }
            ]).exec();
        } else if (organizationId != null) {
            const organizationDocument: OrganizationDocument = await this.findOrganizationOrThrow(organizationId);
            const assessmentDocuments: AssessmentDocument[] = await this.assessmentDocumentRepository.findByOrganization(organizationDocument);
            const objectIds: any[] = [];
            assessmentDocuments.forEach(assessmentDocument => {
                objectIds.push(assessmentDocument._id)
            });

            return await this.candidateAssessmentModel.aggregate([
                {
                    $match: {
                        assessmentDocument: { $in: objectIds },
                        start_date: { $gte: from, $lte: to },
                    }
                },
                {
                    $group: { _id: "$start_date", count: { $count: {} } }
                },
                {
                    $project: {
                        _id: 0,
                        date: "$_id",
                        count: 1,
                    }
                }
            ]).exec();
        }
    }

    async getTimeSeriesCountSubmittedByDate(
        organizationId: string,
        assessmentId: string,
        from: Date,
        to: Date,
    ): Promise<any> {
        if (assessmentId != null) {
            const assessmentDocument: AssessmentDocument = await this.findAssessmentOrThrow(assessmentId);
            return await this.candidateAssessmentModel.aggregate([
                {
                    $match: {
                        assessmentDocument: assessmentDocument._id,
                        end_date: { $gte: from, $lte: to },
                    }
                },
                {
                    $group: { _id: "$end_date", count: { $count: {} } }
                },
                {
                    $project: {
                        _id: 0,
                        date: "$_id",
                        count: 1,
                    }
                }
            ]).exec();
        } else if (organizationId != null) {
            const organizationDocument: OrganizationDocument = await this.findOrganizationOrThrow(organizationId);
            const assessmentDocuments: AssessmentDocument[] = await this.assessmentDocumentRepository.findByOrganization(organizationDocument);

            const objectIds: any[] = [];
            assessmentDocuments.forEach(assessmentDocument => {
                objectIds.push(assessmentDocument._id)
            });

            return await this.candidateAssessmentModel.aggregate([
                {
                    $match: {
                        assessmentDocument: { $in: objectIds },
                        end_date: { $gte: from, $lte: to },
                    }
                },
                {
                    $group: { _id: "$end_date", count: { $count: {} } }
                },
                {
                    $project: {
                        _id: 0,
                        date: "$_id",
                        count: 1,
                    }
                }
            ]).exec();
        }
    }

    async getCountMeetingBasicRequirements(
        organizationId: string,
        assessmentId: string,
        from: Date,
        to: Date,
    ): Promise<number> {
        if (assessmentId != null) {
            const assessmentDocument: AssessmentDocument = await this.findAssessmentOrThrow(assessmentId);
            return await this.candidateAssessmentModel.countDocuments({
                end_date: { $gte: from, $lte: to },
                assessment_decision: { $in: [AssessmentDecision.SHORTLISTED, AssessmentDecision.SMARTLISTED] },
                assessmentDocument: assessmentDocument,
            });
        } else if (organizationId != null) {
            const organizationDocument: OrganizationDocument = await this.findOrganizationOrThrow(organizationId);
            const assessmentDocuments: AssessmentDocument[] = await this.assessmentDocumentRepository.findByOrganization(organizationDocument);
            return await this.candidateAssessmentModel.countDocuments({
                end_date: { $gte: from, $lte: to },
                assessment_decision: { $in: [AssessmentDecision.SHORTLISTED, AssessmentDecision.SMARTLISTED] },
                assessmentDocument: { $in: assessmentDocuments },
            });
        }
    }

    async getCountSmartListed(
        organizationId: string,
        assessmentId: string,
        from: Date,
        to: Date,
    ): Promise<number> {
        if (assessmentId != null) {
            const assessmentDocument: AssessmentDocument = await this.findAssessmentOrThrow(assessmentId);
            return await this.candidateAssessmentModel.countDocuments({
                end_date: { $gte: from, $lte: to },
                assessment_decision: AssessmentDecision.SMARTLISTED,
                assessmentDocument: assessmentDocument,
            });
        } else if (organizationId != null) {
            const organizationDocument: OrganizationDocument = await this.findOrganizationOrThrow(organizationId);
            const assessmentDocuments: AssessmentDocument[] = await this.assessmentDocumentRepository.findByOrganization(organizationDocument);
            return await this.candidateAssessmentModel.countDocuments({
                end_date: { $gte: from, $lte: to },
                assessment_decision: AssessmentDecision.SMARTLISTED,
                assessmentDocument: { $in: assessmentDocuments },
            });
        }
    }

    async getCountOfCompletedAssessments(
        organizationId: string,
        assessmentId: string,
        from: Date,
        to: Date,
    ): Promise<number> {
        if (assessmentId != null) {
            const assessmentDocument: AssessmentDocument = await this.findAssessmentOrThrow(assessmentId);
            return await this.candidateAssessmentModel.countDocuments({
                end_date: { $gte: from, $lte: to },
                status: { $ne: CandidateAssessmentStatus.IN_PROGRESS },
                assessmentDocument: assessmentDocument,
            });
        } else if (organizationId != null) {
            const organizationDocument: OrganizationDocument = await this.findOrganizationOrThrow(organizationId);
            const assessmentDocuments: AssessmentDocument[] = await this.assessmentDocumentRepository.findByOrganization(organizationDocument);
            return await this.candidateAssessmentModel.countDocuments({
                end_date: { $gte: from, $lte: to },
                status: { $ne: CandidateAssessmentStatus.IN_PROGRESS },
                assessmentDocument: { $in: assessmentDocuments },
            });
        }
    }

    async getTimeSeriesCountOfAttempts(
        organizationId: string,
        assessmentId: string,
        from: Date,
        to: Date,
    ): Promise<any> {
        if (assessmentId != null) {
            const assessmentDocument: AssessmentDocument = await this.findAssessmentOrThrow(assessmentId);
            return await this.candidateAttemptLogModel.aggregate([
                {
                    $match: {
                        assessmentDocument: assessmentDocument._id,
                        attempted_on: { $gte: from, $lte: to },
                    }
                },
                {
                    $group: { _id: "$attempted_on", count: { $count: {} } }
                },
                {
                    $sort: { date: 1 }
                },
                {
                    $project: {
                        _id: 0,
                        date: "$_id",
                        count: 1,
                    }
                }
            ]);
        } else if (organizationId != null) {
            const organizationDocument: OrganizationDocument = await this.findOrganizationOrThrow(organizationId);
            const assessmentDocuments: AssessmentDocument[] = await this.assessmentDocumentRepository.findByOrganization(organizationDocument);

            const objectIds: any[] = [];
            assessmentDocuments.forEach(assessmentDocument => {
                objectIds.push(assessmentDocument._id)
            });

            return await this.candidateAttemptLogModel.aggregate([
                {
                    $match: {
                        assessmentDocument: { $in: objectIds },
                        attempted_on: { $gte: from, $lte: to },
                    }
                },
                {
                    $group: { _id: "$attempted_on", count: { $count: {} } }
                },
                {
                    $sort: { date: 1 }
                },
                {
                    $project: {
                        _id: 0,
                        date: "$_id",
                        count: 1,
                    }
                }
            ]);
        }
    }

    async getTimeSeriesCountOfSubmissions(
        organizationId: string,
        assessmentId: string,
        from: Date,
        to: Date,
    ): Promise<any> {
        if (assessmentId != null) {
            const assessmentDocument: AssessmentDocument = await this.findAssessmentOrThrow(assessmentId);
            return await this.candidateAssessmentModel.aggregate([
                {
                    $match: {
                        assessmentDocument: assessmentDocument._id,
                        end_date: { $gte: from, $lte: to },
                    }
                },
                {
                    $group: { _id: "$end_date", count: { $count: {} } },
                },
                {
                    $sort: { date: 1 }
                },
                {
                    $project: {
                        _id: 0,
                        date: "$_id",
                        count: 1,
                    }
                }
            ]);
        } else if (organizationId != null) {
            const organizationDocument: OrganizationDocument = await this.findOrganizationOrThrow(organizationId);
            const assessmentDocuments: AssessmentDocument[] = await this.assessmentDocumentRepository.findByOrganization(organizationDocument);

            const objectIds: any[] = [];
            assessmentDocuments.forEach(assessmentDocument => {
                objectIds.push(assessmentDocument._id)
            });

            return await this.candidateAssessmentModel.aggregate([
                {
                    $match: {
                        assessmentDocument: { $in: objectIds },
                        end_date: { $gte: from, $lte: to },
                    }
                },
                {
                    $group: { _id: "$end_date", count: { $count: {} } },

                },
                {
                    $sort: { date: 1 }
                },
                {
                    $project: {
                        _id: 0,
                        date: "$_id",
                        count: 1,
                    }
                }
            ]);
        }
    }

    async getAllAssessmentSummaryByStatus(
        organizationId: string,
        status: AssessmentStatus,
        from: Date,
        to: Date,
    ): Promise<any> {
        const organizationDocument: OrganizationDocument = await this.findOrganizationOrThrow(organizationId);
        const assessmentDocuments: AssessmentDocument[] = await this.assessmentDocumentRepository.findByOrganizationAndStatus(organizationDocument, status);

        const objectIds: any[] = [];
        assessmentDocuments.forEach(assessmentDocument => {
            objectIds.push(assessmentDocument._id)
        });

        const rawData: any = await this.candidateAssessmentModel.aggregate([
            {
                $match: {
                    assessmentDocument: { $in: objectIds },
                    start_date: { $gte: from, $lte: to },
                }
            },
            {
                $group: {
                    _id: "$assessmentDocument",
                    registered: { $count: {} },
                    completed: { $sum: { $cond: [{ $eq: ['$status', CandidateAssessmentStatus.GRADING_COMPLETED] }, 1, 0] } },
                    smartlisted: { $sum: { $cond: [{ $eq: ['$assessment_decision', AssessmentDecision.SMARTLISTED] }, 1, 0] } }
                },
            },
            {
                $project: {
                    _id: 0,
                    id: "$_id",
                    registered: 1,
                    completed: 1,
                    smartlisted: 1,
                }
            }
        ]);

        rawData.forEach(obj => {
            const assessmentDocument: AssessmentDocument = assessmentDocuments.find(assDoc => assDoc._id.toString() == obj.id.toString());
            if (assessmentDocument) {
                obj.title = assessmentDocument.name;
                obj.department = assessmentDocument.department;
                obj.activeSince = assessmentDocument.activated_on;
            }
        });

        return rawData;
    }

    async getAssessmentPerformanceForAllCandidates(
        assessmentId: string,
        from: Date,
        to: Date,
    ): Promise<any> {
        const assessmentDocument: AssessmentDocument = await this.assessmentDocumentRepository.findById(assessmentId);
        const candidateDocuments: CandidateDocument[] = await this.candidateDocumentRepository.findAll();
        const candidateAssessmentDocuments: CandidateAssessmentDocument[]
            = await this.candidateAssessmentDocumentRepository.findAllForAssessment(assessmentDocument);


        const candidateIds: any[] = [];
        candidateAssessmentDocuments.forEach(candidateAssessmentDocument => {
            if (candidateAssessmentDocument.start_date >= from && candidateAssessmentDocument.start_date <= to) {
                candidateIds.push(candidateAssessmentDocument.candidateDocument)
            }
        });

        const rawData: any = await this.candidateResponseScoreModel.aggregate([
            {
                $match: {
                    assessmentDocument: assessmentDocument._id,
                    candidateDocument: { $in: candidateIds },
                }
            },
            {
                $group: {
                    _id: "$candidateDocument",
                    score: { $sum: "$score" }
                }
            },
            {
                $project: {
                    _id: 0,
                    id: "$_id",
                    score: 1,
                }
            }
        ]);

        rawData.forEach(obj => {
            const candidateDocument: CandidateDocument =
                candidateDocuments.find(candidateDoc => candidateDoc._id.toString() == obj.id.toString());
            if (candidateDocument) {
                obj.name = candidateDocument.name;
            }
            const candidateAssessmentDocument: CandidateAssessmentDocument =
                candidateAssessmentDocuments.find(caDoc => caDoc.candidateDocument.toString() == obj.id.toString()
                    && caDoc.assessmentDocument.toString() == assessmentDocument._id.toString());
            if (candidateAssessmentDocument) {
                obj.start_date = candidateAssessmentDocument.start_date;
                obj.end_date = candidateAssessmentDocument.end_date;
                obj.status = candidateAssessmentDocument.status;
                obj.assessment_decision = candidateAssessmentDocument.assessment_decision;
            }
        });

        return rawData;
    }

    async getAssessmentBlockPerformanceForAllCandidates(
        assessmentBlockId: string,
        from: Date,
        to: Date,
    ): Promise<any> {

        const assessmentBlockDocument: AssessmentBlockDocument = await this.assessmentBlockDocumentRepository.findById(assessmentBlockId);
        const assessmentDocument: AssessmentDocument = await this.assessmentDocumentRepository.findById(assessmentBlockDocument.assessmentDocument.toString());
        const candidateDocuments: CandidateDocument[] = await this.candidateDocumentRepository.findAll();
        const candidateAssessmentDocuments: CandidateAssessmentDocument[]
            = await this.candidateAssessmentDocumentRepository.findAllForAssessment(assessmentDocument);


        const candidateIds: any[] = [];
        candidateAssessmentDocuments.forEach(candidateAssessmentDocument => {
            if (candidateAssessmentDocument.start_date >= from && candidateAssessmentDocument.start_date <= to) {
                candidateIds.push(candidateAssessmentDocument.candidateDocument)
            }
        });

        const rawData: any = await this.candidateResponseScoreModel.aggregate([
            {
                $match: {
                    assessmentBlockDocument: assessmentBlockDocument._id,
                    candidateDocument: { $in: candidateIds },
                }
            },
            {
                $group: {
                    _id: "$candidateDocument",
                    score: { $sum: "$score" }
                }
            },
            {
                $project: {
                    _id: 0,
                    id: "$_id",
                    score: 1,
                }
            }
        ]);

        rawData.forEach(obj => {
            const candidateDocument: CandidateDocument =
                candidateDocuments.find(candidateDoc => candidateDoc._id.toString() == obj.id.toString());
            if (candidateDocument) {
                obj.name = candidateDocument.name;
            }
        });

        return rawData;
    }

    async getLastSubmissionDateForAllCandidates(
        assessmentId: string,
    ): Promise<any> {
        const assessmentDocument: AssessmentDocument = await this.findAssessmentOrThrow(assessmentId);
        return await this.candidateAttemptLogModel.aggregate([
            {
                $match: {
                    assessmentDocument: assessmentDocument._id,
                }
            },
            {
                $group: {
                    _id: "$candidateDocument",
                    last_submission_date: { $max: "$attempted_on" }
                }
            },
            {
                $project: {
                    _id: 0,
                    id: "$_id",
                    last_submission_date: 1,
                }
            }
        ]);
    }

    async getAssessmentDecisionSummariesForOrganizationByStatus(
        organizationId: string,
        status: AssessmentStatus,
    ): Promise<any> {
        const organizationDocument: OrganizationDocument = await this.findOrganizationOrThrow(organizationId);
        const assessmentDocuments: AssessmentDocument[] = await this.assessmentDocumentRepository.findByOrganizationAndStatus(organizationDocument, status);

        const objectIds: any[] = [];
        assessmentDocuments.forEach(assessmentDocument => {
            objectIds.push(assessmentDocument._id)
        });

        return await this.candidateAssessmentModel.aggregate([
            {
                $match: {
                    assessmentDocument: { $in: objectIds },
                }
            },
            {
                $group: {
                    _id: '$assessmentDocument',
                    smartlisted: { $sum: { $cond: [{ $eq: ['$assessment_decision', AssessmentDecision.SMARTLISTED] }, 1, 0] } },
                    shortlisted: { $sum: { $cond: [{ $eq: ['$assessment_decision', AssessmentDecision.SHORTLISTED] }, 1, 0] } },
                    on_hold: { $sum: { $cond: [{ $eq: ['$assessment_decision', AssessmentDecision.ON_HOLD] }, 1, 0] } },
                    regret: { $sum: { $cond: [{ $eq: ['$assessment_decision', AssessmentDecision.REGRET] }, 1, 0] } },
                    decision_pending: {
                        $sum: {
                            $cond: [{
                                $and: [{ $eq: ['$status', CandidateAssessmentStatus.GRADING_COMPLETED] },
                                { $eq: ['$assessment_decision', null] }]
                            }, 1, 0]
                        }
                    },

                },
            },
            {
                $sort: { assessmentId: 1 }
            },
            {
                $project: {
                    _id: 0,
                    assessmentId: "$_id",
                    smartlisted: 1,
                    shortlisted: 1,
                    on_hold: 1,
                    regret: 1,
                    decision_pending: 1,
                }
            }
        ]);
    }

    async getAssessmentStatusSummariesForOrganizationByStatus(
        organizationId: string,
        status: AssessmentStatus,
    ): Promise<any> {
        const organizationDocument: OrganizationDocument = await this.findOrganizationOrThrow(organizationId);
        const assessmentDocuments: AssessmentDocument[] = await this.assessmentDocumentRepository.findByOrganizationAndStatus(organizationDocument, status);

        const objectIds: any[] = [];
        assessmentDocuments.forEach(assessmentDocument => {
            objectIds.push(assessmentDocument._id)
        });

        return await this.candidateAssessmentModel.aggregate([
            {
                $match: {
                    assessmentDocument: { $in: objectIds },
                }
            },
            {
                $group: {
                    _id: "$assessmentDocument",
                    in_progress: { $sum: { $cond: [{ $eq: ['$status', CandidateAssessmentStatus.IN_PROGRESS] }, 1, 0] } },
                    grading_pending: { $sum: { $cond: [{ $eq: ['$status', CandidateAssessmentStatus.GRADING_PENDING] }, 1, 0] } },
                    grading_completed: { $sum: { $cond: [{ $eq: ['$status', CandidateAssessmentStatus.GRADING_COMPLETED] }, 1, 0] } },

                },
            },
            {
                $sort: { assessmentId: 1 }
            },
            {
                $project: {
                    _id: 0,
                    assessmentId: "$_id",
                    in_progress: 1,
                    grading_pending: 1,
                    grading_completed: 1,
                }
            }
        ]);
    }

    async getAssessmentBlockSumOfScoresForAssessment(
        assessmentId: string,
        from: Date,
        to: Date,
    ): Promise<any> {
        const assessmentDocument: AssessmentDocument = await this.findAssessmentOrThrow(assessmentId);
        const assessmentBlockDocuments: AssessmentBlockDocument[] = await this.assessmentBlockDocumentRepository.findAllForAssessment(assessmentDocument);
        const candidateAssessmentDocuments: CandidateAssessmentDocument[]
            = await this.candidateAssessmentDocumentRepository.findAllForAssessmentAndStatus(assessmentDocument,
                CandidateAssessmentStatus.GRADING_COMPLETED);

        const objectIds: any[] = [];
        candidateAssessmentDocuments.forEach(candidateAssessmentDocument => {
            if (candidateAssessmentDocument.start_date >= from && candidateAssessmentDocument.start_date <= to) {
                objectIds.push(candidateAssessmentDocument.assessmentDocument)
            }
        });

        const rawData: any = await this.candidateResponseScoreModel.aggregate([
            {
                $match: {
                    assessmentDocument: { $in: objectIds },
                }
            },
            {
                $group: {
                    _id: "$assessmentBlockDocument",
                    score: { $sum: "$score" }
                }
            },
            {
                $project: {
                    _id: 0,
                    assessmentBlockId: "$_id",
                    score: 1,
                }
            }
        ]);

        rawData.forEach(obj => {
            const assessmentBlockDocument: AssessmentBlockDocument =
                assessmentBlockDocuments.find(assBlkDoc => assBlkDoc._id.toString() == obj.assessmentBlockId.toString());
            if (assessmentBlockDocument) {
                obj.title = assessmentBlockDocument.title;
            }
        });

        return rawData;
    }

    async getCandidateAssessmentBlockScoresForAssessment(
        candidateId: string,
        assessmentId: string,
    ): Promise<any> {
        const candidateDocument: CandidateDocument = await this.findCandidateOrThrow(candidateId);
        const assessmentDocument: AssessmentDocument = await this.findAssessmentOrThrow(assessmentId);

        return await this.candidateResponseScoreModel.aggregate([
            {
                $match: {
                    assessmentDocument: assessmentDocument._id,
                    candidateDocument: candidateDocument._id,
                }
            },
            {
                $group: {
                    _id: "$assessmentBlockDocument",
                    score: { $sum: "$score" }
                }
            },
            {
                $project: {
                    _id: 0,
                    assessmentBlockId: "$_id",
                    score: 1,
                }
            }
        ]);
    }

    async getMaxPossibleAssessmentBlockScoresForAssessment(
        assessmentId: string,
    ): Promise<any> {
        const assessmentDocument: AssessmentDocument = await this.findAssessmentOrThrow(assessmentId);
        const assessmentBlockDocuments: AssessmentBlockDocument[] = await this.assessmentBlockDocumentRepository.findAllForAssessment(assessmentDocument);

        const objectIds: any[] = [];
        assessmentBlockDocuments.forEach(assessmentBlockDocument => {
            objectIds.push(assessmentBlockDocument._id)
        });

        const rawData = await this.questionModel.aggregate([
            {
                $match: {
                    assessmentBlockDocument: { $in: objectIds },
                }
            },
            {
                $group: {
                    _id: "$assessmentBlockDocument",
                    score: { $sum: "$score" }
                }
            },
            {
                $project: {
                    _id: 0,
                    assessmentBlockId: "$_id",
                    score: 1,
                }
            }
        ]);

        rawData.forEach(obj => {
            const assessmentBlockDocument: AssessmentBlockDocument = assessmentBlockDocuments.find(assBlkDoc => assBlkDoc._id.toString() == obj.id.toString());
            if (assessmentBlockDocument) {
                obj.title = assessmentBlockDocument.title;
            }
        });

        return rawData;
    }

    async getBlockScore(assessmentBlockId: string): Promise<any> {
        const assessmentBlockDocument: AssessmentBlockDocument = await this.findAssessmentBlockOrThrow(assessmentBlockId);

        const rawData = await this.questionModel.aggregate([
            {
                $match: {
                    assessmentBlockDocument: assessmentBlockDocument._id,
                }
            },
            {
                $group: {
                    _id: "$assessmentBlockDocument",
                    score: { $sum: "$score" }
                }
            },
            {
                $project: {
                    _id: 0,
                    assessmentBlockId: "$_id",
                    score: 1,
                }
            }
        ]);

        rawData.forEach(obj => {
            obj.title = assessmentBlockDocument.title;
        });

        return rawData;
    }

    async getQuestionCount(assessmentBlockIds: string[]): Promise<any> {
        const assessmentBlockDocuments: AssessmentBlockDocument[] = await this.findAssessmentBlocks(assessmentBlockIds);
        const objectIds: any[] = [];
        assessmentBlockDocuments.forEach(assessmentBlockDocument => {
            objectIds.push(assessmentBlockDocument._id)
        });

        return await this.questionModel.aggregate([
            {
                $match: {
                    assessmentBlockDocument: { $in: objectIds },
                }
            },
            {
                $group: {
                    _id: "$assessmentBlockDocument",
                    count: { $count: {} }
                }
            },
            {
                $project: {
                    _id: 0,
                    id: "$_id",
                    count: 1,
                }
            }
        ]);
    }

    private async findAssessmentOrThrow(assessmentId: string): Promise<AssessmentDocument> {
        const assessmentDocument: AssessmentDocument = await this.assessmentDocumentRepository.findById(assessmentId);
        if (assessmentDocument == null) {
            throw AssessmentResponseCodes.INVALID_ASSESSMENT_ID;
        }
        return assessmentDocument;
    }

    private async findOrganizationOrThrow(organizationId: string): Promise<OrganizationDocument> {
        const organizationDocument: OrganizationDocument = await this.organizationDocumentRepository.findById(organizationId);
        if (organizationDocument == null) {
            throw OrganizationResponseCodes.INVALID_ORGANIZATION_ID;
        }
        return organizationDocument;
    }

    private async findAssessmentBlockOrThrow(assessmentBlockId: string): Promise<AssessmentBlockDocument> {
        const assessmentBlockDocument: AssessmentBlockDocument = await this.assessmentBlockDocumentRepository.findById(assessmentBlockId);
        if (assessmentBlockDocument == null) {
            throw AssessmentBlockResponseCodes.INVALID_ASSESSMENT_BLOCK_ID;
        }
        return assessmentBlockDocument;
    }

    private async findAssessmentBlocks(assessmentBlockIds: string[]): Promise<AssessmentBlockDocument[]> {
        const assessmentBlockDocuments: AssessmentBlockDocument[] = await this.assessmentBlockDocumentRepository.findByIds(assessmentBlockIds);
        return assessmentBlockDocuments;
    }

    private async findCandidateOrThrow(candidateId: string): Promise<CandidateDocument> {
        const candidateDocument: CandidateDocument = await this.candidateDocumentRepository.findById(candidateId);
        if (candidateDocument == null) {
            throw CandidateResponseCodes.INVALID_CANDIDATE_ID;
        }
        return candidateDocument;
    }

}


