package com.smartlist.model;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartlist.enums.QuestionType;
import com.smartlist.module.question.dto.request.QuestionReqDTO;
import com.smartlist.utils.AppResponseCodes;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import jakarta.validation.constraints.NotNull;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "\"question\"")
@Getter
@Setter
public class Question extends BaseEntity{

    public static final String FIELD_ASSESSMENT_BLOCK = "assessmentBlock";

    @Enumerated(EnumType.STRING)
    QuestionType type;

    @Column(length=5000)
    String text;

    Integer score;

    @Column(length=255, name = "\"sort_order\"")
    Integer sortOrder = 0;

    String options;

    @ManyToOne
    @JoinColumn(name = "\"assessment_block_id\"")
    @NotNull
    AssessmentBlock assessmentBlock;

    @OneToMany(mappedBy = AnswerOption.FIELD_QUESTION, cascade = CascadeType.ALL, orphanRemoval = true)
    List<AnswerOption> answerOptions;


    public Question(){

    }

    public Question(final QuestionReqDTO questionReqDto){
        ObjectMapper objectMapper = new ObjectMapper();

        setType(QuestionType.valueOf(questionReqDto.getType()));
        try {
            setOptions(objectMapper.writeValueAsString(questionReqDto.getOptions()) );
        }catch (JsonProcessingException ex){
            throw AppResponseCodes.INTERNAL_SERVER_ERROR;
        }
        setText(questionReqDto.getText());
        setScore(questionReqDto.getScore());
        setAnswerOptions(new ArrayList<>());
        questionReqDto.getAnswerOptions().forEach(answerOptionDto -> {
            AnswerOption answerOption = new AnswerOption();
            answerOption.setCorrect(answerOptionDto.getCorrect());
            answerOption.setText(answerOptionDto.getText());
            answerOption.setQuestion(this);
            answerOption.setScore(answerOptionDto.getScore());
            getAnswerOptions().add(answerOption);
        });
    }
}
