package com.smartlist.module.candidate;

import com.smartlist.model.CandidateAssessment;
import com.smartlist.model.CandidateResponse;
import com.smartlist.model.Question;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CandidateResponseRepository extends CrudRepository<CandidateResponse, Integer> {

    void removeByQuestionAndCandidateAssessment(Question question, CandidateAssessment candidateAssessment);

    List<CandidateResponse> findByCandidateAssessmentAndQuestion(CandidateAssessment candidateAssessment, Question question);

    int countByCandidateAssessment(CandidateAssessment candidateAssessment);
}
