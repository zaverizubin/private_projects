package com.smartlist.model.mocks;

import com.smartlist.enums.QuestionType;
import com.smartlist.model.AssessmentBlock;
import com.smartlist.model.Question;
import org.instancio.Instancio;
import org.instancio.Model;

import java.time.LocalDateTime;
import java.util.List;

import static org.instancio.Select.all;
import static org.instancio.Select.field;

public class QuestionModel extends BaseEntityModel {

    public Model<Question> getModel(List<AssessmentBlock> assessmentBlocks){
        return Instancio.of(Question.class)
                .ignore(field(Question::getId))

                .ignore(field(Question::isDirty))

                .ignore(field(Question::getAnswerOptions))

                .supply(field(Question::getType), () -> List.of(QuestionType.values()).get(this.randomGenerator.nextInt(QuestionType.values().length)))

                .generate(field(Question::getText), generators -> generators.text().loremIpsum().words(5000))

                .generate(field(Question::getScore), generators -> generators.ints().min(0).max(300))

                .supply(field(Question::getOptions), ()-> "{\"file_required\":true,\"text_required\":false}")

                .supply(field(Question::getAssessmentBlock), () -> assessmentBlocks.get(this.randomGenerator.nextInt(assessmentBlocks.size())))

                .generate(all(LocalDateTime.class), generators -> generators.temporal()
                        .localDateTime()
                        .past()
                        .range(LocalDateTime.of(2024,1,1,0,0), LocalDateTime.now()))

                .onComplete(all(Question.class), (Question question) -> question.setText("Text - " + question.getType().toString()))

                .toModel();
    }
}
