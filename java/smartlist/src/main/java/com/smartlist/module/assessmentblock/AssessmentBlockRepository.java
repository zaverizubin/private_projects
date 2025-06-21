package com.smartlist.module.assessmentblock;

import com.smartlist.model.Assessment;
import com.smartlist.model.AssessmentBlock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssessmentBlockRepository extends CrudRepository<AssessmentBlock, Integer> {

    @Query("SELECT ab FROM AssessmentBlock ab LEFT JOIN FETCH ab.questions q WHERE ab.id = :assessmentBlockId")
    Optional<AssessmentBlock> findByIdWithQuestions(final int assessmentBlockId);

    @Query("SELECT MAX(ab.sortOrder) FROM AssessmentBlock ab WHERE ab.assessment.id = :assessmentId")
    Integer getMaxSortOrder(final int assessmentId);

    List<AssessmentBlock> findAllByAssessment(final Assessment assessment);

    @Query("SELECT ab, q FROM AssessmentBlock ab LEFT JOIN FETCH ab.questions q WHERE ab.assessment = :assessment")
    List<AssessmentBlock> findAllByAssessmentWithQuestions(final Assessment assessment);

    @Modifying
    @Query("UPDATE AssessmentBlock ab SET ab.sortOrder = ab.sortOrder -1 WHERE ab.sortOrder > :sortOrder AND ab.assessment.id = :assessmentId")
    void updateSortOrder(final int sortOrder, final int assessmentId);

    int countByAssessment(final Assessment assessment);
}
