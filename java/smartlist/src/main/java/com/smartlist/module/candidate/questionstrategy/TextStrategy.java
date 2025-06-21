package com.smartlist.module.candidate.questionstrategy;

import com.smartlist.model.Question;
import com.smartlist.module.candidate.CandidateResponseCodes;
import com.smartlist.module.candidate.dto.request.SubmitAnswerReqDTO;
import com.smartlist.module.question.AnswerOptionRepository;
import com.smartlist.module.question.QuestionResponseCodes;
import org.apache.commons.lang3.StringUtils;

public class TextStrategy extends BaseQuestionStrategy{

    public TextStrategy(final SubmitAnswerReqDTO submitAnswerReqDto, final Question question,
                        final AnswerOptionRepository answerOptionRepository){
        super(submitAnswerReqDto, question, answerOptionRepository);

    }

    public void validate() {
        if (!this.submitAnswerReqDto.getAnswerIds().isEmpty()) {
            throw CandidateResponseCodes.INVALID_ANSWER_ID;
        }

        if (StringUtils.isEmpty(this.submitAnswerReqDto.getAnswerText())) {
            throw QuestionResponseCodes.INVALID_ANSWER_TEXT;
        }
    }

    @Override
    public int score() {
        return 0;
    }
}
