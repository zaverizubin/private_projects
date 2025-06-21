package com.smartlist.module.question.questionstrategy;

import com.smartlist.module.question.QuestionResponseCodes;
import com.smartlist.module.question.dto.request.QuestionReqDTO;
import com.smartlist.module.question.interfaces.IQuestionStrategy;

public class McqSingleStrategy implements IQuestionStrategy {

    private final QuestionReqDTO questionReqDto;

    public McqSingleStrategy(final QuestionReqDTO questionReqDto){
        this.questionReqDto = questionReqDto;
    }

    @Override
    public void validate() {
        if (this.questionReqDto.getAnswerOptions().size() < 2) {
            throw QuestionResponseCodes.INVALID_ANSWER_OPTIONS_FOR_QUESTION_TYPE;
        }

        int correctCount = this.questionReqDto.getAnswerOptions().stream().mapToInt(ao -> Boolean.TRUE.equals(ao.getCorrect()) ? 1 : 0).sum();
        if (correctCount != 1) {
            throw QuestionResponseCodes.INVALID_ANSWER_OPTION;
        }

        this.questionReqDto.getAnswerOptions().forEach(answerOptionDto -> {
            if (answerOptionDto.getScore() == null || answerOptionDto.getScore() < 0) {
                throw QuestionResponseCodes.INVALID_SCORE;
            }
        });
    }
}
