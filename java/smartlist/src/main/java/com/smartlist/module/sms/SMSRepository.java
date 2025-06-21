package com.smartlist.module.sms;

import com.smartlist.model.Candidate;
import com.smartlist.model.Organization;
import com.smartlist.model.SMSLog;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SMSRepository extends CrudRepository<SMSLog, Integer> {

}
