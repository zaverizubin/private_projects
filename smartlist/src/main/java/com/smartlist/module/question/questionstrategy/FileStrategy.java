package com.smartlist.module.question.questionstrategy;

import com.smartlist.module.question.QuestionResponseCodes;
import com.smartlist.module.question.dto.request.QuestionReqDTO;
import com.smartlist.module.question.interfaces.IQuestionStrategy;

public class FileStrategy implements IQuestionStrategy {

    private final QuestionReqDTO questionReqDto;

    public FileStrategy(final QuestionReqDTO questionReqDto){
        this.questionReqDto = questionReqDto;
    }

    @Override
    public void validate() {
        if (this.questionReqDto.getOptions() == null) {
            throw QuestionResponseCodes.INVALID_QUESTION_OPTION;
        }
        if (!this.questionReqDto.getAnswerOptions().isEmpty()) {
            throw QuestionResponseCodes.INVALID_ANSWER_OPTIONS_FOR_QUESTION_TYPE;
        }

        if (Boolean.TRUE.equals(!this.questionReqDto.getOptions().getFileRequired()) && Boolean.TRUE.equals(!this.questionReqDto.getOptions().getTextRequired())) {
            throw QuestionResponseCodes.INVALID_QUESTION_OPTION;
        }
    }
}
