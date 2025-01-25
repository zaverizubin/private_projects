package com.smartlist.module.user;

import com.smartlist.model.Organization;

import com.smartlist.model.User;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends CrudRepository<User, Integer> {

    Optional<User> findByEmail(final String email);

    List<User> findByOrganization(final Organization organization);

    @Modifying
    @Query("UPDATE User u set u.active = true WHERE u.id = :userId")
    void activateUser(final Integer userId);

}
