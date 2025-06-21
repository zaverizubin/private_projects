package com.smartlist.module.candidate.questionstrategy;

import com.smartlist.model.Question;
import com.smartlist.module.candidate.CandidateResponseCodes;
import com.smartlist.module.candidate.dto.request.SubmitAnswerReqDTO;
import com.smartlist.module.question.AnswerOptionRepository;

import java.util.concurrent.atomic.AtomicInteger;

public class McqSingleWeightedStrategy extends BaseQuestionStrategy{

    public McqSingleWeightedStrategy(final SubmitAnswerReqDTO submitAnswerReqDto, final Question question,
                                     final AnswerOptionRepository answerOptionRepository){
        super(submitAnswerReqDto, question, answerOptionRepository);
    }

    @Override
    public void validate() {
        super.validate();
        if (this.submitAnswerReqDto.getAnswerIds().size() != 1) {
            throw CandidateResponseCodes.INVALID_ANSWER_ID;
        }
    }

    @Override
    public int score() {
        final AtomicInteger score = new AtomicInteger();

        this.question.getAnswerOptions().forEach(answerOption ->
                this.submitAnswerReqDto.getAnswerIds().forEach(id -> {
                    if (answerOption.getId().equals(id)) {
                        score.set(answerOption.getScore());
                    }
            })
        );
        return score.get();
    }

}
