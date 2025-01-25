package com.smartlist.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "\"user_email_invite\"")
@Getter
@Setter
public class UserEmailInvite extends BaseEntity {

    @Column(length=255)
    String email;

    String token;

    @ManyToOne
    @JoinColumn(name = "\"organization_id\"")
    Organization organization;
}
