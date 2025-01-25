package com.smartlist.model.mocks;

import com.smartlist.model.Candidate;
import com.smartlist.model.Question;
import com.smartlist.model.QuestionComment;
import org.instancio.Instancio;
import org.instancio.Model;

import java.time.LocalDateTime;
import java.util.List;

import static org.instancio.Select.all;
import static org.instancio.Select.field;


public class QuestionCommentModel extends BaseEntityModel {

    public Model<QuestionComment> getModel(List<Question> questions, List<Candidate> candidates){
        return Instancio.of(QuestionComment.class)
                .ignore(field(QuestionComment::getId))

                .ignore(field(QuestionComment::isDirty))

                .generate(field(QuestionComment::getUsername), generators -> generators.string().lowerCase().maxLength(15))

                .generate(field(QuestionComment::getComment), generators -> generators.string().lowerCase().maxLength(100))

                .supply(field(QuestionComment::getQuestion), () -> questions.get(this.randomGenerator.nextInt(questions.size())))

                .supply(field(QuestionComment::getCandidate), () -> candidates.get(this.randomGenerator.nextInt(candidates.size())))

                .generate(all(LocalDateTime.class), generators -> generators.temporal()
                        .localDateTime()
                        .past()
                        .range(LocalDateTime.of(2024,1,1,0,0), LocalDateTime.now()))

                .toModel();
    }
}
