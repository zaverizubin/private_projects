package com.smartlist.module.grading;

import com.smartlist.model.*;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GradingRepository extends CrudRepository<CandidateResponseScore, Integer> {

    void removeByCandidateAndQuestion(final Candidate candidate, final Question question);

    List<CandidateResponseScore> findByCandidateAndAssessment(final Candidate candidate, final Assessment assessment);

    List<CandidateResponseScore> findByCandidateAndAssessmentBlock(final Candidate candidate, final AssessmentBlock assessmentBlock);

    int countByCandidateAndAssessment(final Candidate candidate, final Assessment assessment);
}
