package com.smartlist.module.user.dto.request;

import jakarta.validation.constraints.Email;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ForgotPasswordReqDTO {

    @Email
    String email;


}
