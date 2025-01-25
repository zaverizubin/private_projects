package com.smartlist.module.user;

import com.smartlist.model.Organization;
import com.smartlist.model.UserEmailInvite;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserEmailInviteRepository extends CrudRepository<UserEmailInvite, Integer> {

    Optional<UserEmailInvite> findByEmailAndOrganization(final String email, final Organization organization);

    List<UserEmailInvite> findByOrganization(final Organization organization);

    Optional<UserEmailInvite> findByEmail(final String email);

    Optional<UserEmailInvite> findByToken(final String token);

    void deleteByToken(final String token);
}
