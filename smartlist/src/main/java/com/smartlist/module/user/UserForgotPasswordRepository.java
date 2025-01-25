package com.smartlist.module.user;

import com.smartlist.model.User;
import com.smartlist.model.UserForgotPassword;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserForgotPasswordRepository extends CrudRepository<UserForgotPassword, Integer> {

    Optional<UserForgotPassword> findByUser(final User user);

    Optional<UserForgotPassword> findByToken(final String token);
}
