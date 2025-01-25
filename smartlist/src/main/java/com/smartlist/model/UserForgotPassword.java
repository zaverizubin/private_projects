package com.smartlist.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "\"user_forgot_password\"")
@Getter
@Setter
public class UserForgotPassword extends BaseEntity {

    @Column(length=255)
    String token;

    @OneToOne
    @JoinColumn(name = "\"user_id\"")
    User user;

    public UserForgotPassword(){

    }

    public UserForgotPassword(User user, String token){
        this.user = user;
        this.token = token;
    }
}
