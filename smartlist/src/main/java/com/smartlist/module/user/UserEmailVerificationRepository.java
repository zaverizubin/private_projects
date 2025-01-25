package com.smartlist.module.user;

import com.smartlist.model.User;
import com.smartlist.model.UserEmailVerification;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserEmailVerificationRepository extends CrudRepository<UserEmailVerification, Integer> {

    Optional<UserEmailVerification> findByToken(final String token);

    void deleteByToken(final String token);

    void deleteByUser(final User user);
}
