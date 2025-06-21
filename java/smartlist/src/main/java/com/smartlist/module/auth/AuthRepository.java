package com.smartlist.module.auth;

import com.smartlist.model.AuthorizedToken;
import com.smartlist.model.Candidate;
import com.smartlist.model.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuthRepository extends CrudRepository<AuthorizedToken, Integer> {

    Optional<AuthorizedToken> findByAccessTokenHash(String accessTokenHash);

    void deleteByUser(User user);

    void deleteByCandidate(Candidate candidate);
}
