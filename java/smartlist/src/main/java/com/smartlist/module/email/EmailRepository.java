package com.smartlist.module.email;

import com.smartlist.model.EmailLog;
import com.smartlist.model.SMSLog;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmailRepository extends CrudRepository<EmailLog, Integer> {

}
