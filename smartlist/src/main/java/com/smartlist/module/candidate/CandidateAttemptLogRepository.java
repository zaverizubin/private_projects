package com.smartlist.module.candidate;

import com.smartlist.model.CandidateAttemptLog;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CandidateAttemptLogRepository extends CrudRepository<CandidateAttemptLog, Integer> {

}
