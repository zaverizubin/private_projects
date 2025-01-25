package com.smartlist.model.mocks;

import com.smartlist.enums.AssessmentStatus;
import com.smartlist.model.Assessment;
import com.smartlist.model.AssetFile;
import com.smartlist.model.Organization;
import com.smartlist.services.CryptoService;
import org.instancio.Gen;
import org.instancio.Instancio;
import org.instancio.Model;

import java.time.LocalDateTime;
import java.util.List;

import static org.instancio.Select.all;
import static org.instancio.Select.field;

public class AssessmentModel extends BaseEntityModel {

    public Model<Assessment> getModel(final List<Organization> organizations, final List<AssetFile> assetFiles,
                                      final CryptoService cryptoService){
        return Instancio.of(Assessment.class)
                .ignore(field(Assessment::getId))

                .ignore(field(Assessment::isDirty))

                .ignore(field(Assessment::getAssessmentBlocks))

                .generate(field(Assessment::getName), generators -> generators.string().lowerCase().maxLength(100)).withUnique(field(Assessment::getName))

                .generate(field(Assessment::getPosition), generators -> generators.string().lowerCase().maxLength(50))

                .generate(field(Assessment::getDepartment), generators -> generators.string().lowerCase().maxLength(50))

                .generate(field(Assessment::getIntroduction), generators -> generators.text().loremIpsum().words(5000))

                .supply(field(Assessment::getStatus), () -> List.of(AssessmentStatus.values()).get(this.randomGenerator.nextInt(AssessmentStatus.values().length)))

                .supply(field(Assessment::getOrganization), () -> organizations.get(this.randomGenerator.nextInt(organizations.size())))

                .supply(field(Assessment::getHeaderImage), () -> assetFiles.get(this.randomGenerator.nextInt(assetFiles.size())))

                .set(field(Assessment::getVideoLinkURL), Gen.net().url().get().toString())

                .supply(field(Assessment::getToken), () -> cryptoService.generateToken())

                .generate(all(LocalDateTime.class), generators -> generators.temporal()
                        .localDateTime()
                        .past()
                        .range(LocalDateTime.of(2024,1,1,0,0), LocalDateTime.now()))

                .toModel();
    }
}
