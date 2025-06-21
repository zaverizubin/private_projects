package com.smartlist.model.mocks;

import com.smartlist.enums.AssessmentStatus;
import com.smartlist.model.Assessment;
import com.smartlist.model.AssessmentBlock;
import org.instancio.Instancio;
import org.instancio.Model;

import java.time.LocalDateTime;
import java.util.List;

import static org.instancio.Select.all;
import static org.instancio.Select.field;

public class AssessmentBlockModel extends BaseEntityModel {

    public Model<AssessmentBlock> getModel(final List<Assessment> assessments){
        return Instancio.of(AssessmentBlock.class)
                .ignore(field(AssessmentBlock::getId))

                .ignore(field(AssessmentBlock::isDirty))

                .ignore(field(AssessmentBlock::getQuestions))

                .generate(field(AssessmentBlock::getTitle), generators -> generators.string().lowerCase().maxLength(100)).withUnique(field(AssessmentBlock::getTitle))

                .generate(field(AssessmentBlock::getInstruction), generators -> generators.string().lowerCase().maxLength(500))

                .generate(field(AssessmentBlock::getDuration), generators -> generators.ints().min(5))

                .generate(field(AssessmentBlock::getSortOrder), generators -> generators.ints().min(1).max(10))

                .supply(field(AssessmentBlock::getAssessment), () -> assessments.get(this.randomGenerator.nextInt(assessments.size())))

                .generate(all(LocalDateTime.class), generators -> generators.temporal()
                        .localDateTime()
                        .past()
                        .range(LocalDateTime.of(2024,1,1,0,0), LocalDateTime.now()))

                .toModel();
    }
}
