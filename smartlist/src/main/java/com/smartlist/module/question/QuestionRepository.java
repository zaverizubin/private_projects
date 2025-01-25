package com.smartlist.module.question;

import com.smartlist.model.Assessment;
import com.smartlist.model.AssessmentBlock;
import com.smartlist.model.Question;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionRepository extends CrudRepository<Question, Integer> {

    List<Question> findByAssessmentBlock(final AssessmentBlock assessmentBlock);

    @Query("SELECT count(q) FROM Question q JOIN q.assessmentBlock ab JOIN ab.assessment a WHERE a = :assessment")
    int countByAssessment(final Assessment assessment);

    @Query("SELECT q FROM Question q JOIN q.assessmentBlock ab JOIN ab.assessment a WHERE a = :assessment")
    List<Question> findByAssessment(final Assessment assessment);

    @Modifying
    @Query("UPDATE Question q set q.sortOrder = :sortOrder WHERE q.id = :questionId")
    void updateSortOrder(final Integer sortOrder, final Integer questionId);

    @Query("SELECT max(q.sortOrder) FROM Question q WHERE q.assessmentBlock.id = :assessmentBlockId")
    Integer getMaxSortOrder(Integer assessmentBlockId);

    @Override
    @Query("SELECT q FROM Question q WHERE q.id = :questionId")
    @EntityGraph(attributePaths = {"answerOptions"}, type = EntityGraph.EntityGraphType.LOAD)
    Optional<Question> findById(final Integer questionId);

    @Query("SELECT q FROM Question q LEFT JOIN q.answerOptions ao WHERE q.assessmentBlock = :assessmentBlock")
    List<Question> findByAssessmentBlockWithAnswers(final AssessmentBlock assessmentBlock);
}
