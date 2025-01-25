package com.smartlist.model.mocks;

import com.smartlist.model.User;
import com.smartlist.model.UserForgotPassword;
import com.smartlist.services.CryptoService;
import org.instancio.Instancio;
import org.instancio.Model;

import java.util.List;

import static org.instancio.Select.field;


public class UserForgotPasswordModel extends BaseEntityModel {

    public Model<UserForgotPassword> getModel(final CryptoService cryptoService, final List<User> users){
        return Instancio.of(UserForgotPassword.class)
                .ignore(field(UserForgotPassword::getId))

                .ignore(field(UserForgotPassword::isDirty))

                .supply(field(UserForgotPassword::getUser), () -> users.get(this.randomGenerator.nextInt(users.size())))

                .supply(field(UserForgotPassword::getToken), () -> cryptoService.generateToken())

                .toModel();
    }
}
