package com.smartlist.model.mocks;

import com.smartlist.model.User;
import com.smartlist.model.UserEmailVerification;
import com.smartlist.services.CryptoService;
import org.instancio.Instancio;
import org.instancio.Model;

import java.util.List;

import static org.instancio.Select.field;


public class UserEmailVerificationModel extends BaseEntityModel {

    public Model<UserEmailVerification> getModel(final CryptoService cryptoService, final List<User> users){
        return Instancio.of(UserEmailVerification.class)
                .ignore(field(UserEmailVerification::getId))

                .ignore(field(UserEmailVerification::isDirty))

                .supply(field(UserEmailVerification::getUser), () -> users.get(this.randomGenerator.nextInt(users.size())))

                .supply(field(UserEmailVerification::getToken), () -> cryptoService.generateToken())

                .toModel();
    }
}
