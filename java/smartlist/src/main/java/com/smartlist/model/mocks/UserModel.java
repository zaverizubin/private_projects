package com.smartlist.model.mocks;

import com.smartlist.enums.Role;
import com.smartlist.model.AssetFile;
import com.smartlist.model.Organization;
import com.smartlist.model.User;
import org.instancio.Gen;
import org.instancio.Instancio;
import org.instancio.Model;

import java.time.LocalDateTime;
import java.util.List;

import static org.instancio.Select.all;
import static org.instancio.Select.field;


public class UserModel extends BaseEntityModel {

    public Model<User> getModel(final List<AssetFile> assetFiles, final List<Organization> organizations){
        return Instancio.of(User.class)
                .ignore(field(User::getId))

                .ignore(field(User::isDirty))

                .supply(field(User::getOrganization), () -> organizations.get(this.randomGenerator.nextInt(organizations.size())))

                .generate(field(User::getEmail), Gen.net().email()).withUnique(field(User::getEmail))

                .generate(field(User::getPassword), generators -> generators.string().lowerCase().maxLength(15))

                .generate(field(User::getDepartment), generators -> generators.string().lowerCase().maxLength(15))

                .generate(field(User::getDesignation), generators -> generators.string().lowerCase().maxLength(15))

                .set(field(User::isActive), Instancio.of(Boolean.class).create())

                .supply(field(User::getRole), () -> Role.getUserRoles().get(this.randomGenerator.nextInt(Role.getUserRoles().size())))

                .supply(field(User::getPhoto), () -> assetFiles.get(this.randomGenerator.nextInt(assetFiles.size())))

                .generate(all(LocalDateTime.class), generators -> generators.temporal()
                        .localDateTime()
                        .past()
                        .range(LocalDateTime.of(2024,1,1,0,0), LocalDateTime.now()))

                .toModel();
    }
}
