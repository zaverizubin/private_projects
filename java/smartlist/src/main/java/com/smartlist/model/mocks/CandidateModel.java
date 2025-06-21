package com.smartlist.model.mocks;

import com.smartlist.model.AssetFile;
import com.smartlist.model.Candidate;
import com.smartlist.model.User;
import com.smartlist.utils.AppUtils;
import org.instancio.Gen;
import org.instancio.Instancio;
import org.instancio.Model;

import java.time.LocalDateTime;
import java.util.List;

import static org.instancio.Select.all;
import static org.instancio.Select.field;


public class CandidateModel extends BaseEntityModel {

    public Model<Candidate> getModel(List<AssetFile> assetFiles){
        return Instancio.of(Candidate.class)
                .ignore(field(Candidate::getId))

                .ignore(field(Candidate::isDirty))

                .ignore(field(Candidate::getCandidateAssessments))

                .generate(field(Candidate::getName), generators -> generators.string().lowerCase().maxLength(15)).withUnique(field(Candidate::getName))

                .generate(field(Candidate::getEmail), Gen.net().email()).withUnique(field(Candidate::getEmail))

                .generate(field(Candidate::getContactNumber), generators -> generators.text().pattern("#d#d#d-#d#d-#d#d")).withUnique(field(Candidate::getEmail))

                .supply(field(Candidate::getVerificationCode), AppUtils::generateOTP)

                .set(field(Candidate::isVerified), Instancio.of(Boolean.class).create())

                .supply(field(Candidate::getPhoto), () -> assetFiles.get(this.randomGenerator.nextInt(assetFiles.size())))

                .generate(all(LocalDateTime.class), generators -> generators.temporal()
                        .localDateTime()
                        .past()
                        .range(LocalDateTime.of(2024,1,1,0,0), LocalDateTime.now()))

                .toModel();
    }
}
