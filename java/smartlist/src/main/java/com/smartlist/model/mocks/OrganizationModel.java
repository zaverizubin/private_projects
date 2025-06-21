package com.smartlist.model.mocks;

import com.smartlist.model.AssetFile;
import com.smartlist.model.Organization;
import org.instancio.Gen;
import org.instancio.Instancio;
import org.instancio.Model;

import java.time.LocalDateTime;
import java.util.List;

import static org.instancio.Select.all;
import static org.instancio.Select.field;

public class OrganizationModel extends BaseEntityModel {

    public Model<Organization> getModel(final List<AssetFile> assetFiles){
        return Instancio.of(Organization.class)
                .ignore(field(Organization::getId))

                .ignore(field(Organization::getUsers))

                .ignore(field(Organization::getAssessments))

                .ignore(field(AssetFile::isDirty))

                .set(field(Organization::getLogo), assetFiles.get(this.randomGenerator.nextInt(assetFiles.size())))

                .generate(field(Organization::getName), generators -> generators.string().lowerCase().maxLength(50))
                .withUnique(field(Organization::getName))

                .set(field(Organization::getUrl), Gen.net().url().get().toString())

                .generate(field(Organization::getEmail), Gen.net().email())

                .generate(field(Organization::getContactNumber), generators -> generators.text().pattern("#d#d#d-#d#d-#d#d"))

                .generate(field(Organization::getAbout), generators -> generators.text().loremIpsum().words(5000))

                .generate(all(LocalDateTime.class), generators -> generators.temporal()
                        .localDateTime()
                        .past()
                        .range(LocalDateTime.of(2024,1,1,0,0), LocalDateTime.now()))
                .toModel();
    }
}
