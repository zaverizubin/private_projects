package com.smartlist.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "\"user_email_verification\"")
@Getter
@Setter
public class UserEmailVerification extends BaseEntity {

    @Column(length=255)
    String token;

    @OneToOne
    @JoinColumn(name = "\"user_id\"")
    User user;

    public UserEmailVerification(){

    }

    public UserEmailVerification(User user, String token){
        this.user = user;
        this.token = token;
    }
}
