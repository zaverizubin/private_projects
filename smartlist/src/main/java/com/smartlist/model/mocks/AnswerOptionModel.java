package com.smartlist.model.mocks;

import com.smartlist.model.AnswerOption;
import com.smartlist.model.Question;
import org.instancio.Instancio;
import org.instancio.Model;

import java.time.LocalDateTime;
import java.util.List;

import static org.instancio.Select.all;
import static org.instancio.Select.field;

public class AnswerOptionModel extends BaseEntityModel {

    public Model<AnswerOption> getModel(List<Question> questions){
        return Instancio.of(AnswerOption.class)
                .ignore(field(AnswerOption::getId))

                .ignore(field(AnswerOption::isDirty))

                .generate(field(AnswerOption::getText), generators -> generators.text().loremIpsum().words(50))

                .supply(field(AnswerOption::getQuestion), () -> questions.get(this.randomGenerator.nextInt(questions.size())))

                .generate(field(AnswerOption::getScore), generators -> generators.ints().min(0).max(300))

                .generate(all(LocalDateTime.class), generators -> generators.temporal()
                        .localDateTime()
                        .past()
                        .range(LocalDateTime.of(2024,1,1,0,0), LocalDateTime.now()))

                .onComplete(all(AnswerOption.class), (AnswerOption answerOption) -> {
                    answerOption.setScore(Math.min(answerOption.getScore(), answerOption.getQuestion().getScore()));
                })

                .toModel();
    }
}
