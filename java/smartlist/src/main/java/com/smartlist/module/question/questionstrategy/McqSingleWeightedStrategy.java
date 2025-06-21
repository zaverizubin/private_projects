package com.smartlist.module.question.questionstrategy;

import com.smartlist.module.question.QuestionResponseCodes;
import com.smartlist.module.question.dto.request.AnswerOptionReqDTO;
import com.smartlist.module.question.dto.request.QuestionReqDTO;
import com.smartlist.module.question.interfaces.IQuestionStrategy;

public class McqSingleWeightedStrategy implements IQuestionStrategy {

    private final QuestionReqDTO questionReqDto;

    public McqSingleWeightedStrategy(final QuestionReqDTO questionReqDto){
        this.questionReqDto = questionReqDto;
    }

    @Override
    public void validate() {
        int correctCount = this.questionReqDto.getAnswerOptions().stream().mapToInt(ao -> Boolean.TRUE.equals(ao.getCorrect()) ? 1 : 0).sum();
        if (correctCount != this.questionReqDto.getAnswerOptions().size()) {
            throw QuestionResponseCodes.INVALID_ANSWER_OPTION;
        }

        this.questionReqDto.getAnswerOptions().forEach(answerOptionDto -> {
            if (answerOptionDto.getScore() == null || answerOptionDto.getScore() < 0) {
                throw QuestionResponseCodes.INVALID_SCORE;
            }
        });

        int maxScore = 0;
        for(int i =0; i < this.questionReqDto.getAnswerOptions().size(); i++){
            AnswerOptionReqDTO answerOptionReqDto = this.questionReqDto.getAnswerOptions().get(i);
            if (answerOptionReqDto.getScore() > maxScore) {
                maxScore = answerOptionReqDto.getScore();
            }
        }
        this.questionReqDto.setScore(maxScore);
    }
}
