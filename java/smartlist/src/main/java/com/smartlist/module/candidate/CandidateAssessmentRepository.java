package com.smartlist.module.candidate;

import com.smartlist.model.Assessment;
import com.smartlist.model.Candidate;
import com.smartlist.model.CandidateAssessment;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CandidateAssessmentRepository extends CrudRepository<CandidateAssessment, Integer> {

    @Query("SELECT ca FROM CandidateAssessment ca WHERE ca.assessment.token = :token and ca.candidate = :candidate")
    Optional<CandidateAssessment> findByCandidateAndAssessmentToken(final Candidate candidate, @Param("token") final String token);

    Optional<CandidateAssessment> findByCandidate(final Candidate candidate);

    Optional<CandidateAssessment> findByCandidateAndAssessment(final Candidate candidate, final Assessment assessment);

    @Query("SELECT count(ca) FROM CandidateAssessment ca  WHERE ca.assessment = :assessment AND ca.status = 'grading_completed'")
    Integer getCountOfCompletedAssessments(final @Param("assessment") Assessment assessment);
}
