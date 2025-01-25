package com.smartlist.module.grading;

import com.smartlist.model.Assessment;
import com.smartlist.model.Candidate;
import com.smartlist.model.Question;
import com.smartlist.model.QuestionComment;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionCommentRepository extends CrudRepository<QuestionComment, Integer> {

    List<QuestionComment> findByCandidateAndQuestion(final Candidate candidate, final Question question);

    QuestionComment findFirstByCandidateAndQuestionAndUsername(final Candidate candidate, final Question question, final String username);

    @Query("""
            SELECT qc FROM QuestionComment qc JOIN qc.question q
             JOIN q.assessmentBlock ab JOIN ab.assessment a
              WHERE a = :assessment and qc.candidate = :candidate ORDER BY qc.version""")
    List<QuestionComment> findByCandidateAndAssessment(final Candidate candidate, final Assessment assessment);
}
