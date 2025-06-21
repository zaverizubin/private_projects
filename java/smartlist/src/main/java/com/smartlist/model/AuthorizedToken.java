package com.smartlist.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "\"authorized_token\"")
@Getter
@Setter
public class AuthorizedToken extends BaseEntity {

    @Column(name = "\"refresh_token_hash\"")
    String refreshTokenHash;

    @Column(name = "\"access_token_hash\"")
    String accessTokenHash;

    @OneToOne
    @JoinColumn(name = "\"candidate_id\"")
    Candidate candidate;

    @OneToOne
    @JoinColumn(name = "\"user_id\"")
    User user;
}
