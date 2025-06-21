package com.smartlist.module.candidate.questionstrategy;

import com.smartlist.model.Question;
import com.smartlist.module.candidate.CandidateResponseCodes;
import com.smartlist.module.candidate.dto.request.SubmitAnswerReqDTO;
import com.smartlist.module.question.AnswerOptionRepository;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class SurveyStrategy extends BaseQuestionStrategy{

    public SurveyStrategy(final SubmitAnswerReqDTO submitAnswerReqDto, final Question question,
                          final AnswerOptionRepository answerOptionRepository){
        super(submitAnswerReqDto, question, answerOptionRepository);

        if(this.submitAnswerReqDto.getAnswerIds().isEmpty()){
            throw CandidateResponseCodes.INVALID_ANSWER_ID;
        }
    }

    @Override
    public int score() {
        List<Integer> answerOptions = this.submitAnswerReqDto.getAnswerIds();
        List<Integer> correctAnswerOptions = new ArrayList<>();
        this.question.getAnswerOptions().forEach(answerOption -> {
            if (answerOption.isCorrect()) {
                correctAnswerOptions.add(answerOption.getId());
            }
        });
        correctAnswerOptions.sort(Comparator.naturalOrder());
        answerOptions.sort(Comparator.naturalOrder());
        int matchCount = 0;

        for (Integer correctAnswerOption : correctAnswerOptions) {
            if (answerOptions.contains(correctAnswerOption)) {
                matchCount++;
            }
        }

        return matchCount > 0 ? this.question.getScore() : 0;

    }
}
