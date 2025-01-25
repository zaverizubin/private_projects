package com.smartlist.module.question;

import com.smartlist.model.AnswerOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnswerOptionRepository extends CrudRepository<AnswerOption, Integer> {

}
