package com.smartlist.module.assessment;

import com.smartlist.enums.AssessmentStatus;
import com.smartlist.model.Assessment;
import com.smartlist.model.Organization;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssessmentRepository extends CrudRepository<Assessment, Integer> {

    List<Assessment> findByOrganizationAndStatus(final Organization organization, final AssessmentStatus status);

    Optional<Assessment> findByToken(final String token);

    Optional<Assessment> findByNameAndOrganization(final String name, final Organization organization);

    List<Assessment> findByStatusAndOrganizationAndNameContaining(final AssessmentStatus status, final Organization organization, final String name);

    List<Assessment> findByOrganization(final Organization organization);

    @Query("SELECT a FROM Assessment a LEFT JOIN FETCH a.assessmentBlocks ab WHERE a.token = :token")
    Optional<Assessment> findByTokenWithAssessmentBlocks(final String token);

    @Query("SELECT a FROM Assessment a  LEFT JOIN FETCH a.assessmentBlocks ab WHERE a.id = :assessmentId")
    Optional<Assessment> findByIdWithRelations(final Integer assessmentId);

}
