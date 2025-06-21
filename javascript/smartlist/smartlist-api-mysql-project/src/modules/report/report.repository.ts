import { AssessmentDecision } from 'src/enums/assessment.decision';
import { CandidateAssessmentStatus } from 'src/enums/candidate.assessment.status';
import { EntityManager, EntityRepository } from 'typeorm';

@EntityRepository()
export class ReportRepository {
  constructor(private entityManager: EntityManager) {}

  async getCountCompleted(
    organizationId: number,
    assessementId: number,
    from: string,
    to: string,
  ): Promise<number> {
    let query = `
      SELECT COUNT(ca.id) as count 
      FROM candidate_assessment ca
      INNER JOIN assessment a on ca.assessment_id  = a.id
      WHERE ca.end_date BETWEEN '${from}' AND  '${to}'`;

    if (assessementId != null) {
      query += ` AND a.id=${assessementId}`;
    } else if (organizationId != null) {
      query += ` AND a.organization_id = ${organizationId}`;
    }
    const rawData = await this.entityManager.query(query);
    return Number(rawData[0].count);
  }

  async getCountAttempted(
    organizationId: number,
    assessementId: number,
    from: string,
    to: string,
  ): Promise<number> {
    let query = `
      SELECT COUNT(ca.id) as count
      FROM candidate_assessment ca
      INNER JOIN assessment a on ca.assessment_id  = a.id
      WHERE ca.start_date BETWEEN '${from}' AND  '${to}'`;
    if (assessementId != null) {
      query += ` AND a.id=${assessementId}`;
    } else if (organizationId != null) {
      query += ` AND a.organization_id = ${organizationId}`;
    }
    const rawData = await this.entityManager.query(query);
    return Number(rawData[0].count);
  }

  async getCountRegistered(
    organizationId: number,
    assessementId: number,
  ): Promise<number> {
    let query = `
      SELECT COUNT(ca.id) as count
      FROM candidate_assessment ca
      LEFT JOIN assessment a on ca.assessment_id  = a.id`;
    if (assessementId != null) {
      query += ` WHERE a.id=${assessementId}`;
    } else if (organizationId != null) {
      query += ` WHERE a.organization_id = ${organizationId}`;
    }
    const rawData = await this.entityManager.query(query);
    return Number(rawData[0].count);
  }

  async getTimeSeriesCountRegisteredByDate(
    organizationId: number,
    assessementId: number,
    from: string,
    to: string,
  ): Promise<any> {
    let whereClause = '';
    if (assessementId != null) {
      whereClause += ` AND a.id=${assessementId}`;
    } else if (organizationId != null) {
      whereClause += ` AND a.organization_id = ${organizationId}`;
    }
    const query = `
      SELECT Date(ca.start_date) as \`date\`, COUNT(ca.start_date) as \`count\`
      FROM candidate_assessment ca
      INNER JOIN assessment a on ca.assessment_id  = a.id
      WHERE ca.start_date BETWEEN '${from}' AND  '${to}' ${whereClause} 
      GROUP BY DATE(ca.start_date)`;

    return await this.entityManager.query(query);
  }

  async getTimeSeriesCountSubmittedByDate(
    organizationId: number,
    assessementId: number,
    from: string,
    to: string,
  ): Promise<any> {
    let whereClause = '';
    if (assessementId != null) {
      whereClause += ` AND a.id=${assessementId}`;
    } else if (organizationId != null) {
      whereClause += ` AND a.organization_id = ${organizationId}`;
    }
    const query = `
      SELECT Date(ca.end_date) as \`date\`, COUNT(ca.end_date) as \`count\`
      FROM candidate_assessment ca
      INNER JOIN assessment a on ca.assessment_id  = a.id
      WHERE ca.end_date BETWEEN '${from}' AND  '${to}' ${whereClause} 
      GROUP BY DATE(ca.end_date)`;
    console.log(query);
    return await this.entityManager.query(query);
  }

  async getCountMeetingBasicRequirements(
    organizationId: number,
    assessementId: number,
    from: string,
    to: string,
  ): Promise<number> {
    let query = `
    SELECT COUNT(ca.id) as count
    FROM candidate_assessment ca
    INNER JOIN assessment a on ca.assessment_id  = a.id
    WHERE ca.end_date BETWEEN '${from}' AND  '${to}'
      AND (ca.assessmentDecision = '${AssessmentDecision.SHORTLISTED}' OR ca.assessmentDecision = '${AssessmentDecision.SMARTLISTED}')
    `;
    if (assessementId != null) {
      query += ` AND a.id=${assessementId}`;
    } else if (organizationId != null) {
      query += ` AND a.organization_id = ${organizationId}`;
    }
    const rawData = await this.entityManager.query(query);
    return Number(rawData[0].count);
  }

  async getCountSmartListed(
    organizationId: number,
    assessementId: number,
    from: string,
    to: string,
  ): Promise<number> {
    let query = `
    SELECT COUNT(ca.id) as count
    FROM candidate_assessment ca
    INNER JOIN assessment a on ca.assessment_id  = a.id
    WHERE ca.end_date BETWEEN '${from}' AND  '${to}'
      AND ca.assessmentDecision = '${AssessmentDecision.SMARTLISTED}'`;

    if (assessementId != null) {
      query += ` AND a.id=${assessementId}`;
    } else if (organizationId != null) {
      query += ` AND a.organization_id = ${organizationId}`;
    }
    const rawData = await this.entityManager.query(query);
    return Number(rawData[0].count);
  }

  async getCountOfCompletedAssessments(
    organizationId: number,
    assessementId: number,
    from: string,
    to: string,
  ): Promise<number> {
    let query = `
    SELECT COUNT(ca.id) as count
    FROM candidate_assessment ca
    INNER JOIN assessment a on ca.assessment_id  = a.id
    WHERE ca.end_date BETWEEN '${from}' AND  '${to}'
      AND ca.status NOT IN('${CandidateAssessmentStatus.IN_PROGRESS}')`;

    if (assessementId != null) {
      query += ` AND a.id=${assessementId}`;
    } else if (organizationId != null) {
      query += ` AND a.organization_id = ${organizationId}`;
    }
    const rawData = await this.entityManager.query(query);
    return Number(rawData[0].count);
  }

  async getTimeSeriesCountOfAttempts(
    organizationId: number,
    assessementId: number,
    from: string,
    to: string,
  ): Promise<any> {
    let whereClause = '';
    if (assessementId != null) {
      whereClause += ` AND a.id=${assessementId}`;
    } else if (organizationId != null) {
      whereClause += ` AND a.organization_id = ${organizationId}`;
    }

    const query = `
    SELECT Date(attempted_on) as \`date\`, COUNT(attempted_on) as \`count\`
    FROM candidate_attempt_log cal
    INNER JOIN assessment a ON cal.assessment_id  = a.id 
    WHERE attempted_on BETWEEN '${from}' AND  '${to}' ${whereClause} 
    GROUP BY DATE(cal.attempted_on)`;
    console.log('getTimeSeriesCountOfAttemptsquery: ', query);
    return await this.entityManager.query(query);
  }

  async getTimeSeriesCountOfSubmissions(
    organizationId: number,
    assessementId: number,
    from: string,
    to: string,
  ): Promise<number> {
    let whereClause = '';
    if (assessementId != null) {
      whereClause += ` AND a.id=${assessementId}`;
    } else if (organizationId != null) {
      whereClause += ` AND a.organization_id = ${organizationId}`;
    }

    const query = `
      SELECT Date(ca.end_date) as \`date\`, COUNT(ca.id) as \`count\` 
      FROM candidate_assessment ca
      INNER JOIN assessment a on ca.assessment_id  = a.id
      WHERE ca.end_date BETWEEN '${from}' AND  '${to}' ${whereClause} 
      GROUP BY DATE(ca.end_date) ORDER BY DATE(ca.end_date) ASC`;
    console.log('getTimeSeriesCountOfSubmissions: ', query);
    return await this.entityManager.query(query);
  }

  async getAllAssessmentSummaryByStatus(
    organizationId: number,
    status: string,
    from: string,
    to: string,
  ): Promise<any> {
    return await this.entityManager.query(
      `SELECT ca.assessment_id AS id, a.name AS title, a.department AS department, a.activated_on AS activeSince,
          COUNT(ca.ID) AS registered,
          SUM(CASE 
                      WHEN ca.status = '${CandidateAssessmentStatus.GRADING_COMPLETED}' THEN 1
                      ELSE 0
                      END) AS completed,
          SUM(CASE 
                      WHEN ca.assessmentDecision = '${AssessmentDecision.SMARTLISTED}' THEN 1
                      ELSE 0
                      END) AS smartlisted
          FROM candidate_assessment ca 
          INNER JOIN assessment a ON ca.assessment_id  = a.id
          WHERE a.organization_id = ${organizationId}
            AND a.status = '${status}' 
            AND ca.start_date BETWEEN '${from}' AND '${to}'
          GROUP BY ca.assessment_id, a.name, a.department, a.activated_on`,
    );
  }

  async getAssessmentStatusSummaryCount(
    assessmentId: number,
    from: string,
    to: string,
  ): Promise<any> {
    return await this.entityManager.query(
      `SELECT 
      SUM(CASE 
            WHEN ca.status = '${CandidateAssessmentStatus.IN_PROGRESS}' THEN 1
            ELSE 0
          END) AS inProgress,
      SUM(CASE 
            WHEN ca.status = '${CandidateAssessmentStatus.GRADING_COMPLETED}' THEN 1
            ELSE 0
          END) AS completed,
      SUM(CASE 
            WHEN assessmentDecision IS NOT NULL  THEN 1
            ELSE 0
          END) AS screened    
      FROM candidate_assessment ca
      WHERE ca.assessment_id = ${assessmentId}
        AND ca.start_date BETWEEN '${from}' AND '${to}'`,
    );
  }

  async getAssessmentPerformanceForAllCandidates(
    assessmentId: number,
    from: string,
    to: string,
  ): Promise<any> {
    return await this.entityManager
      .query(`SELECT c.id, c.name, ca.start_date as startDate, ca.end_date AS endDate, ca.status, ca.assessmentDecision, SUM(crs.score) AS score 
        FROM candidate_assessment ca
        INNER JOIN candidate c ON ca.candidate_id = c.id
        LEFT JOIN candidate_response_score crs ON ca.assessment_id = crs.assessment_id AND ca.candidate_id = crs.candidate_id 
        WHERE ca.assessment_id = ${assessmentId} 
          AND ca.start_date BETWEEN '${from}' AND '${to}'
          AND (crs.assessment_id = ${assessmentId} OR crs.assessment_id is null) 
        GROUP BY c.id, c.name, ca.start_date, ca.end_date, ca.status, ca.assessmentDecision`);
  }

  async getAssessmentBlockPerformanceForAllCandidates(
    assessmentBlockId: number,
    from: string,
    to: string,
  ): Promise<any> {
    return await this.entityManager
      .query(`SELECT c.id, c.name, SUM(score) AS score
              FROM candidate_response_score crs
              INNER JOIN candidate c on crs.candidate_id  = c.id 
              INNER JOIN candidate_assessment ca ON ca.assessment_id = crs.assessment_id AND ca.candidate_id = crs.candidate_id
              WHERE crs.assessment_block_id =  ${assessmentBlockId}
                AND ca.start_date BETWEEN '${from}' AND '${to}'
              GROUP BY c.id, c.name, crs.assessment_block_id`);
  }

  async getLastSubmissionDateForAllCandidates(
    assessmentId: number,
  ): Promise<any> {
    return await this.entityManager
      .query(`SELECT candidate_id as id, MAX(attempted_on) as lastSubmissionDate
              FROM candidate_attempt_log cal WHERE assessment_id = ${assessmentId}
              GROUP BY candidate_id `);
  }

  async getAssessmentDecisionSummariesForOrganizationByStatus(
    organizationId: number,
    status: string,
  ): Promise<any> {
    return await this.entityManager.query(`
      SELECT ca.assessment_id as assessmentId,
        SUM(CASE 
            WHEN assessmentDecision ='smartlisted' THEN 1
            ELSE 0
            END) AS smartlisted,

        SUM(CASE 
            WHEN assessmentDecision ='shortlisted' THEN 1
            ELSE 0
            END) AS shortlisted,

       SUM(CASE 
              WHEN assessmentDecision ='on_hold' THEN 1
              ELSE 0
              END) AS onHold,

        SUM(CASE 
              WHEN assessmentDecision ='regret' THEN 1
              ELSE 0
              END) AS regret,

        SUM(CASE 
            WHEN assessmentDecision IS NULL AND ca.status ='grading_completed' THEN 1
            ELSE 0
            END) AS decisionPending

      FROM candidate_assessment ca
      INNER JOIN assessment a on ca.assessment_id = a.id
      WHERE a.organization_id = ${organizationId} and a.status = '${status}'
      GROUP BY ca.assessment_id
      ORDER BY ca.assessment_id ASC`);
  }

  async getAssessmentStatusSummariesForOrganizationByStatus(
    organizationId: number,
    status: string,
  ): Promise<any> {
    return await this.entityManager.query(`
      SELECT ca.assessment_id as assessmentId,
      SUM(CASE 
          WHEN ca.status ='in_progress' THEN 1
          ELSE 0
          END) AS inProgress,

      SUM(CASE 
          WHEN ca.status ='grading_pending' THEN 1
          ELSE 0
          END) AS gradingPending,

      SUM(CASE 
            WHEN ca.status ='grading_completed' THEN 1
            ELSE 0
            END) AS gradingCompleted

    FROM candidate_assessment ca
    INNER JOIN assessment a on ca.assessment_id = a.id
    WHERE a.organization_id = ${organizationId} and a.status = '${status}'
    GROUP BY ca.assessment_id
    ORDER BY ca.assessment_id ASC`);
  }

  async getAssessmentBlockSumOfScoresForAssessment(
    assessmentId: number,
    from: string,
    to: string,
  ): Promise<any> {
    return await this.entityManager.query(
      `SELECT crs.assessment_block_id AS assessmentBlockId, ab.title,  SUM(score) AS score 
       FROM candidate_response_score  crs
       INNER JOIN candidate_assessment ca ON ca.assessment_id = crs.assessment_id AND crs.candidate_id = ca.candidate_id
       INNER JOIN assessment_block ab ON ab.id = crs.assessment_block_id
       WHERE ca.assessment_id = ${assessmentId}
        AND ca.status = '${CandidateAssessmentStatus.GRADING_COMPLETED}'
        AND ca.start_date BETWEEN '${from}' AND '${to}' 
       GROUP BY crs.assessment_block_id, ab.title`,
    );
  }

  async getCandidateAssessmentBlockScoresForAssessment(
    candidateId: number,
    assessmentId: number,
  ): Promise<any> {
    return await this.entityManager.query(
      `SELECT crs.assessment_block_id as assessmentBlockId, ab.title as title, SUM(score) AS score
       FROM candidate_response_score crs
       INNER JOIN assessment_block ab on crs.assessment_block_id =  ab.id
      WHERE crs.assessment_id = ${assessmentId} AND crs.candidate_id = ${candidateId}
      GROUP BY crs.assessment_block_id, ab.title`,
    );
  }

  async getMaxPossibleAssessmentBlockScoresForAssessment(
    assessmentId: number,
  ): Promise<any> {
    return await this.entityManager.query(
      `SELECT q.assessment_block_id as assessmentBlockId, ab.title as title,  SUM(q.score) as score
      FROM question q
      INNER JOIN assessment_block ab on ab.id = q.assessment_block_id
      WHERE ab.assessment_id  = ${assessmentId}
      GROUP BY q.assessment_block_id`,
    );
  }
}
