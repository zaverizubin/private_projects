package com.smartlist.module.candidate.questionstrategy;

import com.smartlist.module.candidate.interfaces.IQuestionStrategy;
import com.smartlist.model.AnswerOption;
import com.smartlist.model.Question;
import com.smartlist.module.candidate.CandidateResponseCodes;
import com.smartlist.module.candidate.dto.request.SubmitAnswerReqDTO;
import com.smartlist.module.question.AnswerOptionRepository;
import com.smartlist.utils.AppUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.server.ResponseStatusException;

import java.util.Objects;
import java.util.Optional;

public abstract class BaseQuestionStrategy implements IQuestionStrategy {

    protected final AnswerOptionRepository answerOptionRepository;
    protected final SubmitAnswerReqDTO submitAnswerReqDto;
    protected final Question question;

    protected BaseQuestionStrategy(final SubmitAnswerReqDTO submitAnswerReqDto, final Question question, final AnswerOptionRepository answerOptionRepository) {
        this.submitAnswerReqDto= submitAnswerReqDto;
        this.question = question;
        this.answerOptionRepository = answerOptionRepository;
    }

    public void validate() {
        if (AppUtils.arrayHasDuplicates(this.submitAnswerReqDto.getAnswerIds())) {
            throw CandidateResponseCodes.INVALID_ANSWER_ID;
        }

        for (int i = 0; i < this.submitAnswerReqDto.getAnswerIds().size(); i++) {
            Optional<AnswerOption> optionalAnswerOption = this.answerOptionRepository.findById(this.submitAnswerReqDto.getAnswerIds().get(i));
            AnswerOption answerOption =  optionalAnswerOption.orElseThrow(this::throwIfAnswerOptionInvalid);

            if (!Objects.equals(answerOption.getQuestion().getId(), this.question.getId())) {
                throw CandidateResponseCodes.INVALID_ANSWER_ID;
            }
        }
    }

    private ResponseStatusException throwIfAnswerOptionInvalid() {
        return CandidateResponseCodes.INVALID_ANSWER_ID;
    }
}
