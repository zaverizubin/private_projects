package com.smartlist.module.candidate.questionstrategy;

import com.smartlist.model.Question;
import com.smartlist.module.candidate.dto.request.SubmitAnswerReqDTO;
import com.smartlist.module.candidate.interfaces.IQuestionStrategy;
import com.smartlist.module.file.FileRepository;
import com.smartlist.module.question.AnswerOptionRepository;
import org.springframework.stereotype.Service;

@Service
public class QuestionStrategyFactory {

    private final AnswerOptionRepository answerOptionRepository;
    private final FileRepository fileRepository;

    public QuestionStrategyFactory(final AnswerOptionRepository answerOptionRepository, final FileRepository fileRepository){
        this.answerOptionRepository = answerOptionRepository;
        this.fileRepository = fileRepository;
    }

    public IQuestionStrategy getQuestionStrategy(final SubmitAnswerReqDTO submitAnswerReqDto, final Question question){

        IQuestionStrategy questionStrategy = null;

        switch (question.getType()) {
            case SCORED_MCQ_SINGLE -> questionStrategy = new McqSingleStrategy(submitAnswerReqDto, question, this.answerOptionRepository);
            case SCORED_MCQ_SINGLE_WEIGHTED_SELECT -> questionStrategy = new McqSingleWeightedStrategy(submitAnswerReqDto, question, this.answerOptionRepository);
            case SCORED_MCQ_MULTIPLE -> questionStrategy = new McqMultipleStrategy(submitAnswerReqDto, question, this.answerOptionRepository);
            case SURVEY -> questionStrategy = new SurveyStrategy(submitAnswerReqDto, question, this.answerOptionRepository);
            case TEXT_RESPONSE -> questionStrategy = new TextStrategy(submitAnswerReqDto, question, this.answerOptionRepository);
            case VIDEO_RESPONSE -> questionStrategy = new VideoStrategy(submitAnswerReqDto, question, this.answerOptionRepository, this.fileRepository);
            case FILE_RESPONSE -> questionStrategy = new FileStrategy(submitAnswerReqDto, question, this.answerOptionRepository, this.fileRepository);
        }
        return questionStrategy;

    }
}
