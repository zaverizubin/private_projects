package com.smartlist.module.report;

import com.smartlist.module.report.records.ReportData1;
import com.smartlist.module.report.records.ReportData2;
import com.smartlist.module.report.records.ReportData3;
import org.springframework.stereotype.Repository;

import java.util.Collections;
import java.util.List;

@Repository
public class ReportCandidateRepository {

    public Integer getCountCompleted(final Integer organizationId, final Integer assessmentId,
                                     final String isoFormattedDateAtSOD, final String isoFormattedDateAtEOD){
        return 0;
    }

    public Integer getCountAttempted(final Integer assessmentId, final String isoFormattedDateAtSOD, final String isoFormattedDateAtEOD){
        return 0;
    }

    public Integer getCountRegistered(final Integer organizationId, final Integer assessmentId){
        return 0;
    }

    public Integer getCountMeetingBasicRequirements(final Integer organizationId, final Integer assessmentId,
                                                    final String isoFormattedDateAtSOD, final String isoFormattedDateAtEOD){
        return 0;
    }

    public Integer getCountSmartListed(final Integer organizationId, final Integer assessmentId,
                                       final String isoFormattedDateAtSOD, final String isoFormattedDateAtEOD){
        return 0;
    }


    public Integer getCountOfCompletedAssessments(final Integer organizationId, final Integer assessmentId,
                                                  final String isoFormattedDateAtSOD, final String isoFormattedDateAtEOD){
        return 0;
    }

    public List<ReportData1> getAssessmentBlockSumOfScoresForAssessment(final Integer assessmentId, final String isoFormattedDateAtSOD, final String isoFormattedDateAtEOD){
        return Collections.emptyList();
    }

    public List<ReportData1> getMaxPossibleAssessmentBlockScoresForAssessment(final Integer assessmentId){
        return Collections.emptyList();
    }

    public List<ReportData2>  getAssessmentPerformanceForAllCandidates(final Integer assessmentId, final String isoFormattedDateAtSOD, final String isoFormattedDateAtEOD){
        return Collections.emptyList();
    }

    public List<ReportData3> getLastSubmissionDateForAllCandidates(final Integer assessmentId){
        return Collections.emptyList();
    }

    public List<ReportData2> getAssessmentBlockPerformanceForAllCandidates(final Integer assessmentBlockId, final String isoFormattedDateAtSOD, final String isoFormattedDateAtEOD){
        return Collections.emptyList();
    }

    public List<ReportData1> getCandidateAssessmentBlockScoresForAssessment(final Integer candidateId, final Integer assessmentId){
        return Collections.emptyList();
    }
}
