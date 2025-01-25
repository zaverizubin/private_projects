package com.smartlist.model.mocks;

import com.smartlist.model.Organization;
import com.smartlist.model.UserEmailInvite;
import com.smartlist.services.CryptoService;
import org.instancio.Gen;
import org.instancio.Instancio;
import org.instancio.Model;

import java.util.List;

import static org.instancio.Select.field;


public class UserEmailInviteModel extends BaseEntityModel {

    public Model<UserEmailInvite> getModel(final CryptoService cryptoService, final List<Organization> organizations){
        return Instancio.of(UserEmailInvite.class)
                .ignore(field(UserEmailInvite::getId))

                .ignore(field(UserEmailInvite::isDirty))

                .supply(field(UserEmailInvite::getOrganization), () -> organizations.get(this.randomGenerator.nextInt(organizations.size())))

                .generate(field(UserEmailInvite::getEmail), Gen.net().email()).withUnique(field(UserEmailInvite::getEmail))

                .supply(field(UserEmailInvite::getToken), () -> cryptoService.generateToken())

                .toModel();
    }
}
