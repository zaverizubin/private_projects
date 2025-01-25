package com.smartlist.module.report;

import com.smartlist.enums.AssessmentDecision;
import com.smartlist.enums.AssessmentStatus;
import com.smartlist.enums.CandidateAssessmentStatus;
import com.smartlist.module.report.records.ReportData5;
import com.smartlist.module.report.records.ReportData6;
import com.smartlist.module.report.records.ReportData7;
import com.smartlist.module.report.records.ReportData8;
import com.smartlist.utils.CustomObjectMapper;
import jakarta.persistence.*;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Repository
public class ReportOrganizationRepository {

    @PersistenceContext(unitName = "entityManagerFactory")
    private EntityManager entityManager;

    public Long getCountCompleted(final Integer organizationId, final LocalDate fromDate, final LocalDate toDate){
        TypedQuery<Long> query = this.entityManager.createQuery("""
                SELECT COUNT(ca) FROM CandidateAssessment ca
                 WHERE ca.assessment.organization.id = :organizationId
                 AND ca.endDate BETWEEN :fromDate AND :toDate""",
                Long.class);
        query.setParameter("organizationId", organizationId);
        query.setParameter("fromDate", LocalDateTime.of(fromDate, LocalTime.MIN));
        query.setParameter("toDate", LocalDateTime.of(toDate, LocalTime.MIN));
        return query.getSingleResult();
    }

    public Long getCountAttempted(final Integer organizationId, final LocalDate fromDate, final LocalDate toDate){
        TypedQuery<Long> query = this.entityManager.createQuery("""
                SELECT COUNT(ca) FROM CandidateAssessment ca
                 WHERE ca.assessment.organization.id = :organizationId
                 AND ca.startDate BETWEEN :fromDate AND :toDate""",
                Long.class);
        query.setParameter("organizationId", organizationId);
        query.setParameter("fromDate", LocalDateTime.of(fromDate, LocalTime.MIN));
        query.setParameter("toDate", LocalDateTime.of(toDate, LocalTime.MIN));
        return query.getSingleResult();
    }

    public Long getCountRegistered(final Integer organizationId){
        TypedQuery<Long> query = this.entityManager.createQuery("""
                SELECT COUNT(ca) FROM CandidateAssessment ca
                 WHERE ca.assessment.organization.id = :organizationId""",
                Long.class);
        query.setParameter("organizationId", organizationId);

        return query.getSingleResult();
    }

    public Long getCountMeetingBasicRequirements(final Integer organizationId, final LocalDate fromDate, final LocalDate toDate){
        TypedQuery<Long> query = this.entityManager.createQuery("""
                SELECT COUNT(ca) FROM CandidateAssessment ca
                 WHERE ca.assessment.organization.id = :organizationId
                 AND ca.endDate between :fromDate AND :toDate
                 AND (ca.assessmentDecision = :assessmentDecision1 OR ca.assessmentDecision = :assessmentDecision2)""",
                Long.class);
        query.setParameter("organizationId", organizationId);
        query.setParameter("fromDate", LocalDateTime.of(fromDate, LocalTime.MIN));
        query.setParameter("toDate", LocalDateTime.of(toDate, LocalTime.MIN));
        query.setParameter("assessmentDecision1", AssessmentDecision.SHORTLISTED);
        query.setParameter("assessmentDecision2", AssessmentDecision.SMARTLISTED);

        return query.getSingleResult();
    }

    public Long getCountSmartListed(final Integer organizationId, final LocalDate fromDate, final LocalDate toDate){
        TypedQuery<Long> query = this.entityManager.createQuery("""
                SELECT COUNT(ca) FROM CandidateAssessment ca
                 WHERE ca.assessment.organization.id = :organizationId
                 AND ca.assessmentDecision = :assessmentDecision
                 AND ca.endDate between :fromDate AND :toDate""", Long.class);
        query.setParameter("organizationId", organizationId);
        query.setParameter("assessmentDecision",  AssessmentDecision.SMARTLISTED);
        query.setParameter("fromDate", LocalDateTime.of(fromDate, LocalTime.MIN));
        query.setParameter("toDate", LocalDateTime.of(toDate, LocalTime.MIN));
        return query.getSingleResult();
    }


    public Long getCountOfCompletedAssessments(final Integer organizationId, final LocalDate fromDate, final LocalDate toDate){
        TypedQuery<Long> query = this.entityManager.createQuery("""
                SELECT COUNT(ca) FROM CandidateAssessment ca WHERE
                 ca.assessment.organization.id = :organizationId
                 AND ca.status <> :status
                 AND ca.endDate between :fromDate AND :toDate""", Long.class);
        query.setParameter("organizationId", organizationId);
        query.setParameter("status",  CandidateAssessmentStatus.IN_PROGRESS);
        query.setParameter("fromDate", LocalDateTime.of(fromDate, LocalTime.MIN));
        query.setParameter("toDate", LocalDateTime.of(toDate, LocalTime.MIN));
        return query.getSingleResult();
    }


    public List<ReportData5> getAllAssessmentSummaryByStatus(final Integer organizationId, final AssessmentStatus status, final LocalDate fromDate, final LocalDate toDate) {
        Query query = this.entityManager.createNativeQuery("""
               SELECT a.id as assessmentId, a.name as title, a.department as department, a.activated_on as activatedOn, COUNT(ca.Id) as registered,
                          SUM(CASE WHEN ca.status = 'GRADING_COMPLETED' THEN 1 ELSE 0 END) as completed,
                          SUM(CASE WHEN ca.assessment_decision = 'SMARTLISTED' THEN 1 ELSE 0 END) as smartListed
                          FROM candidate_assessment ca
                          INNER JOIN assessment a on ca.assessment_id = a.id
                          INNER JOIN organization o on a.organization_id = o.id
                          WHERE o.id = :organizationId
                           AND a.status = :status
                           AND ca.start_date BETWEEN :fromDate AND :toDate
                         GROUP BY a.id, a.name, a.department, a.activated_on""", Tuple.class);
        query.setParameter("organizationId", organizationId);
        query.setParameter("status", status.toString());
        query.setParameter("fromDate", LocalDateTime.of(fromDate, LocalTime.MIN));
        query.setParameter("toDate", LocalDateTime.of(toDate, LocalTime.MIN));

         return (List<ReportData5>)CustomObjectMapper.convertToEntity(query.getResultList(), ReportData5.class);

    }

    public List<ReportData6> getAssessmentDecisionSummariesForOrganizationByStatus(final Integer organizationId, final AssessmentStatus status) {
        Query query = this.entityManager.createNativeQuery("""
               SELECT ca.assessment_id as assessmentId,
                    SUM(CASE WHEN assessment_decision ='SMARTLISTED' THEN 1 ELSE 0 END) AS smartlisted,
                    SUM(CASE WHEN assessment_decision ='SHORTLISTED' THEN 1 ELSE 0 END) AS shortlisted,
                    SUM(CASE WHEN assessment_decision ='ON_HOLD' THEN 1 ELSE 0 END) AS onHold,
                    SUM(CASE WHEN assessment_decision ='REGRET' THEN 1 ELSE 0 END) AS regret,
                    SUM(CASE WHEN assessment_decision IS NULL AND ca.status ='GRADING_COMPLETED' THEN 1 ELSE 0 END) AS decisionPending
            
                  FROM candidate_assessment ca
                  INNER JOIN assessment a on ca.assessment_id = a.id
                  WHERE a.organization_id = :organizationId and a.status = :status 
                  GROUP BY ca.assessment_id
                  ORDER BY ca.assessment_id""", Tuple.class);
        query.setParameter("organizationId", organizationId);
        query.setParameter("status", status.toString());

        return (List<ReportData6>)CustomObjectMapper.convertToEntity(query.getResultList(), ReportData6.class);

    }

    public List<ReportData7> getAssessmentStatusSummariesForOrganizationByStatus(final Integer organizationId, final AssessmentStatus status) {
        Query query = this.entityManager.createNativeQuery("""
               SELECT ca.assessment_id as assessmentId,
                     SUM(CASE WHEN ca.status ='IN_PROGRESS' THEN 1 ELSE 0 END) AS inProgress,
                     SUM(CASE WHEN ca.status ='GRADING_PENDING' THEN 1 ELSE 0 END) AS gradingPending,
                     SUM(CASE WHEN ca.status ='GRADING_COMPLETED' THEN 1 ELSE 0 END) AS gradingCompleted
               
                   FROM candidate_assessment ca
                   INNER JOIN assessment a on ca.assessment_id = a.id
                   WHERE a.organization_id = :organizationId and a.status = :status
                   GROUP BY ca.assessment_id
                   ORDER BY ca.assessment_id""", Tuple.class);
        query.setParameter("organizationId", organizationId);
        query.setParameter("status", status.toString());

        return (List<ReportData7>)CustomObjectMapper.convertToEntity(query.getResultList(), ReportData7.class);
    }

    public List<ReportData8> getTimeSeriesCountRegisteredByDate(final Integer organizationId, final LocalDate fromDate, final LocalDate toDate) {
        Query query = this.entityManager.createNativeQuery("""
               SELECT CAST(ca.start_date AS date) as d1, COUNT(ca.start_date) as d2 
                        FROM candidate_assessment ca
                        INNER JOIN assessment a on ca.assessment_id = a.id
                        INNER JOIN organization o on a.organization_id = o.id
                        WHERE o.id = :organizationId
                        AND ca.start_date BETWEEN :fromDate AND :toDate
                        GROUP BY CAST(ca.start_date AS date)""");
        query.setParameter("organizationId", organizationId);
        query.setParameter("fromDate", LocalDateTime.of(fromDate, LocalTime.MIN));
        query.setParameter("toDate", LocalDateTime.of(toDate, LocalTime.MIN));

        List<Object[][]> values  = query.getResultList();
        List<ReportData8> dataList = new ArrayList<>();
        for (Object[] value:values) {
            dataList.add(new ReportData8(((Date)value[0]).toLocalDate(), (Integer)value[1]));
        }
        return dataList;
    }

    public List<ReportData8> getTimeSeriesCountSubmittedByDate(final Integer organizationId, final LocalDate fromDate, final LocalDate toDate) {
        Query query = this.entityManager.createNativeQuery("""
               SELECT CAST(ca.end_date AS date) as d1, COUNT(ca.end_date) as d2 
                                    FROM candidate_assessment ca
                                    INNER JOIN assessment a on ca.assessment_id = a.id
                                    INNER JOIN organization o on a.organization_id = o.id
                                    WHERE o.id = :organizationId
                                    AND ca.end_date BETWEEN :fromDate AND :toDate
                                    GROUP BY CAST(ca.end_date AS date)""");
        query.setParameter("organizationId", organizationId);
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
