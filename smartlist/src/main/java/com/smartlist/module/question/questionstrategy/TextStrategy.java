package com.smartlist.module.question.questionstrategy;

import com.smartlist.module.question.QuestionResponseCodes;
import com.smartlist.module.question.dto.request.QuestionReqDTO;
import com.smartlist.module.question.interfaces.IQuestionStrategy;

public class TextStrategy implements IQuestionStrategy {

    private final QuestionReqDTO questionReqDto;

    public TextStrategy(final QuestionReqDTO questionReqDto){
        this.questionReqDto = questionReqDto;
    }

    @Override
    public void validate() {
        if (!this.questionReqDto.getAnswerOptions().isEmpty()) {
            throw QuestionResponseCodes.INVALID_ANSWER_OPTIONS_FOR_QUESTION_TYPE;
        }
    }
}
