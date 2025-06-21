package com.smartlist.module.report;

import com.smartlist.enums.AssessmentDecision;
import com.smartlist.enums.CandidateAssessmentStatus;
import com.smartlist.module.report.records.ReportData1;
import com.smartlist.module.report.records.ReportData2;
import com.smartlist.module.report.records.ReportData3;
import com.smartlist.module.report.records.ReportData8;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import jakarta.persistence.TypedQuery;

import org.hibernate.transform.Transformers;

import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Repository
public class ReportAssessmentRepository{

    @PersistenceContext(unitName = "entityManagerFactory")
    private EntityManager entityManager;

    public Long getCountCompleted(final Integer assessmentId, final LocalDate fromDate, final LocalDate toDate){
        TypedQuery<Long> query = this.entityManager.createQuery("""
                SELECT COUNT(ca) FROM CandidateAssessment ca
                 WHERE ca.assessment.id = :assessmentId
                 AND ca.endDate BETWEEN :fromDate AND :toDate""",
                Long.class);
        query.setParameter("assessmentId", assessmentId);
        query.setParameter("fromDate", LocalDateTime.of(fromDate, LocalTime.MIN));
        query.setParameter("toDate", LocalDateTime.of(toDate, LocalTime.MIN));
        return query.getSingleResult();
    }

    public Long getCountAttempted(final Integer assessmentId, final LocalDate fromDate, final LocalDate toDate){
        TypedQuery<Long> query = this.entityManager.createQuery("""
                SELECT COUNT(ca) FROM CandidateAssessment ca
                 WHERE ca.assessment.id = :assessmentId
                 AND ca.startDate BETWEEN :fromDate AND :toDate""",
                Long.class);
            query.setParameter("assessmentId", assessmentId);
            query.setParameter("fromDate", LocalDateTime.of(fromDate, LocalTime.MIN));
            query.setParameter("toDate", LocalDateTime.of(toDate, LocalTime.MIN));
            return query.getSingleResult();
    }

    public Long getCountRegistered(final Integer assessmentId){
        TypedQuery<Long> query = this.entityManager.createQuery("""
                SELECT COUNT(ca) FROM CandidateAssessment ca
                 WHERE ca.assessment.id = :assessmentId""",
                Long.class);
        query.setParameter("assessmentId", assessmentId);

        return query.getSingleResult();
    }

    public Long getCountMeetingBasicRequirements(final Integer assessmentId, final LocalDate fromDate, final LocalDate toDate){
        TypedQuery<Long> query = this.entityManager.createQuery("""
                SELECT COUNT(ca) FROM CandidateAssessment ca
                 WHERE ca.assessment.id = :assessmentId
                 AND ca.endDate between :fromDate AND :toDate
                 AND (ca.assessmentDecision = :assessmentDecision1 OR ca.assessmentDecision = :assessmentDecision2)""",
                Long.class);
        query.setParameter("assessmentId", assessmentId);
        query.setParameter("fromDate", LocalDateTime.of(fromDate, LocalTime.MIN));
        query.setParameter("toDate", LocalDateTime.of(toDate, LocalTime.MIN));
        query.setParameter("assessmentDecision1", AssessmentDecision.SHORTLISTED);
        query.setParameter("assessmentDecision2", AssessmentDecision.SMARTLISTED);

        return query.getSingleResult();
    }

    public Long getCountSmartListed(final Integer assessmentId, final LocalDate fromDate, final LocalDate toDate){
        TypedQuery<Long> query = this.entityManager.createQuery("""
                SELECT COUNT(ca) FROM CandidateAssessment ca
                 WHERE ca.assessment.id = :assessmentId
                 AND ca.assessmentDecision = :assessmentDecision
                 AND ca.endDate between :fromDate AND :toDate""", Long.class);
        query.setParameter("assessmentId", assessmentId);
        query.setParameter("assessmentDecision",  AssessmentDecision.SMARTLISTED);
        query.setParameter("fromDate", LocalDateTime.of(fromDate, LocalTime.MIN));
        query.setParameter("toDate", LocalDateTime.of(toDate, LocalTime.MIN));
        return query.getSingleResult();
    }


    public Long getCountOfCompletedAssessments(final Integer assessmentId, final LocalDate fromDate, final LocalDate toDate){
        TypedQuery<Long> query = this.entityManager.createQuery("""
                SELECT COUNT(ca) FROM CandidateAssessment ca WHERE
                 ca.assessment.id = :assessmentId
                 AND ca.status <> :status
                 AND ca.endDate between :fromDate AND :toDate""", Long.class);
        query.setParameter("assessmentId", assessmentId);
        query.setParameter("status",  CandidateAssessmentStatus.IN_PROGRESS);
        query.setParameter("fromDate", LocalDateTime.of(fromDate, LocalTime.MIN));
        query.setParameter("toDate", LocalDateTime.of(toDate, LocalTime.MIN));
        return query.getSingleResult();
    }

    public List<ReportData1> getAssessmentBlockSumOfScoresForAssessment(final Integer assessmentId, final LocalDate fromDate, final LocalDate toDate){
        TypedQuery<ReportData1> query = this.entityManager.createQuery("""
               SELECT new com.smartlist.module.report.records.ReportData1(crs.assessmentBlock.id, crs.assessmentBlock.title,  SUM(crs.score)) 
                FROM CandidateResponseScore  crs
                JOIN CandidateAssessment ca ON ca.assessment = crs.assessment AND crs.candidate = ca.candidate
                WHERE ca.assessment.id = :assessmentId
                AND ca.status = :status
                AND ca.startDate BETWEEN :fromDate AND :toDate
                GROUP BY crs.assessmentBlock.id, crs.assessmentBlock.title""", ReportData1.class);
        query.setParameter("assessmentId", assessmentId);
        query.setParameter("status",  CandidateAssessmentStatus.GRADING_COMPLETED);
        query.setParameter("fromDate", LocalDateTime.of(fromDate, LocalTime.MIN));
        query.setParameter("toDate", LocalDateTime.of(toDate, LocalTime.MIN));
        return query.getResultList();
    }

    public List<ReportData1> getMaxPossibleAssessmentBlockScoresForAssessment(final Integer assessmentId){
        TypedQuery<ReportData1> query = this.entityManager.createQuery("""
               SELECT new com.smartlist.module.report.records.ReportData1(q.assessmentBlock.id, q.assessmentBlock.title,  SUM(q.score))
               FROM Question q
               WHERE q.assessmentBlock.assessment.id  = :assessmentId
               GROUP BY q.assessmentBlock.id, q.assessmentBlock.title""", ReportData1.class);
        query.setParameter("assessmentId", assessmentId);
        return query.getResultList();
    }

    public List<ReportData2>  getAssessmentPerformanceForAllCandidates(final Integer assessmentId, final LocalDate fromDate, final LocalDate toDate){
        TypedQuery<ReportData2> query = this.entityManager.createQuery("""
               SELECT new com.smartlist.module.report.records.ReportData2(ca.candidate.id, ca.candidate.name, ca.startDate, ca.endDate, ca.status, ca.assessmentDecision, SUM(crs.score))
               FROM CandidateAssessment ca
               LEFT JOIN CandidateResponseScore crs ON ca.assessment = crs.assessment AND ca.candidate = crs.candidate
               WHERE ca.assessment.id = :assessmentId
               AND ca.startDate BETWEEN :fromDate AND :toDate
               AND (crs.assessment.id = :assessmentId OR crs.assessment is null)
               GROUP BY ca.candidate.id, ca.candidate.name, ca.startDate, ca.endDate, ca.status, ca.assessmentDecision""", ReportData2.class);
        query.setParameter("assessmentId", assessmentId);
        query.setParameter("fromDate", LocalDateTime.of(fromDate, LocalTime.MIN));
        query.setParameter("toDate", LocalDateTime.of(toDate, LocalTime.MIN));
        return query.getResultList();
    }

    public List<ReportData3> getLastSubmissionDateForAllCandidates(final Integer assessmentId){
        TypedQuery<ReportData3> query = this.entityManager.createQuery("""
               SELECT new com.smartlist.module.report.records.ReportData3(cal.candidate.id, MAX(cal.attemptedOn))
               FROM CandidateAttemptLog cal
               WHERE cal.assessment.id = :assessmentId
               GROUP BY cal.candidate.id""", ReportData3.class);
        query.setParameter("assessmentId", assessmentId);
        return query.getResultList();
    }

    public List<ReportData2> getAssessmentBlockPerformanceForAllCandidates(final Integer assessmentBlockId, final LocalDate fromDate, final LocalDate toDate){
        TypedQuery<ReportData2> query = this.entityManager.createQuery("""
               SELECT new com.smartlist.module.report.records.ReportData2(crs.candidate.id, crs.candidate.name, SUM(crs.score)) 
                FROM CandidateResponseScore crs
                INNER JOIN CandidateAssessment ca ON ca.assessment = crs.assessment AND ca.candidate = crs.candidate
                WHERE crs.assessmentBlock.id =  :assessmentBlockId
                AND ca.startDate BETWEEN :fromDate AND :toDate
                GROUP BY crs.candidate.id, crs.candidate.name, crs.assessmentBlock.id""", ReportData2.class);
        query.setParameter("assessmentBlockId", assessmentBlockId);
        query.setParameter("fromDate", LocalDateTime.of(fromDate, LocalTime.MIN));
        query.setParameter("toDate", LocalDateTime.of(toDate, LocalTime.MIN));
        return query.getResultList();
    }

    public List<ReportData1> getCandidateAssessmentBlockScoresForAssessment(final Integer candidateId, final Integer assessmentId){
        TypedQuery<ReportData1> query = this.entityManager.createQuery("""
               SELECT new com.smartlist.module.report.records.ReportData1(crs.assessmentBlock.id, crs.assessmentBlock.title, SUM(crs.score))
                FROM CandidateResponseScore crs
                WHERE crs.assessment.id = :assessmentId AND crs.candidate.id = :candidateId
                GROUP BY crs.assessmentBlock.id, crs.assessmentBlock.title""", ReportData1.class);
        query.setParameter("assessmentId", assessmentId);
        query.setParameter("candidateId", candidateId);
        return query.getResultList();
    }

    public List<ReportData8> getTimeSeriesCountRegisteredByDate(final Integer assessmentId, final LocalDate fromDate, final LocalDate toDate) {
        Query query = this.entityManager.createNativeQuery("""
               SELECT CAST(ca.start_date AS date) as d1, COUNT(ca.start_date) as d2 
                        FROM candidate_assessment ca
                        WHERE ca.assessment_id = :assessmentId
                        AND ca.start_date BETWEEN :fromDate AND :toDate
                        GROUP BY CAST(ca.start_date AS date)""");
        query.setParameter("assessmentId", assessmentId);
        query.setParameter("fromDate", LocalDateTime.of(fromDate, LocalTime.MIN));
        query.setParameter("toDate", LocalDateTime.of(toDate, LocalTime.MIN));

        List<Object[][]> values  = query.getResultList();
        List<ReportData8> dataList = new ArrayList<>();
        for (Object[] value:values) {
            dataList.add(new ReportData8(((Date)value[0]).toLocalDate(), (Integer)value[1]));
        }
        return dataList;
    }

    public List<ReportData8> getTimeSeriesCountSubmittedByDate(final Integer assessmentId, final LocalDate fromDate, final LocalDate toDate) {
        Query query = this.entityManager.createNativeQuery("""
               SELECT CAST(ca.end_date AS date) as d1, COUNT(ca.end_date) as d2 
                                    FROM candidate_assessment ca
                                    WHERE ca.assessment_id = :assessmentId
                                    AND ca.end_date BETWEEN :fromDate AND :toDate
                                    GROUP BY CAST(ca.end_date AS date)""");
        query.setParameter("assessmentId", assessmentId);
        query.setParameter("fromDate", LocalDateTime.of(fromDate, LocalTime.MIN));
        query.setParameter("toDate", LocalDateTime.of(toDate, LocalTime.MIN));

        List<Object[][]> values  = query.getResultList();
        List<ReportData8> dataList = new ArrayList<>();
        for (Object[] value:values) {
            dataList.add(new ReportData8(((Date)value[0]).toLocalDate(), (Integer)value[1]));
        }
        return dataList;
    }
}
