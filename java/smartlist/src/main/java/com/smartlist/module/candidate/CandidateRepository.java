package com.smartlist.module.candidate;

import com.smartlist.model.Candidate;
import com.smartlist.model.Organization;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CandidateRepository extends CrudRepository<Candidate, Integer> {

    Optional<Candidate> findByContactNumber(String contactNumber);

    @Query("SELECT c FROM Candidate c JOIN c.candidateAssessments ca WHERE ca.assessment.organization = :organization AND c.name LIKE %:name%")
    List<Candidate> findByNameForOrganization(@Param("name") String name, Organization organization);

    Optional<Candidate> findByEmail(String email);
}
