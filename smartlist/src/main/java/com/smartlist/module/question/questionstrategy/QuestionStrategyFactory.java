package com.smartlist.module.question.questionstrategy;

import com.smartlist.enums.QuestionType;
import com.smartlist.module.question.dto.request.QuestionReqDTO;
import com.smartlist.module.question.interfaces.IQuestionStrategy;

public class QuestionStrategyFactory {

   private QuestionStrategyFactory(){

   }

   public static IQuestionStrategy getQuestionStrategy(QuestionReqDTO questionReqDto){

      return switch (QuestionType.valueOf(questionReqDto.getType())) {
         case SCORED_MCQ_SINGLE -> new McqSingleStrategy(questionReqDto);
         case SCORED_MCQ_SINGLE_WEIGHTED_SELECT -> new McqSingleWeightedStrategy(questionReqDto);
         case SCORED_MCQ_MULTIPLE -> new McqMultipleStrategy(questionReqDto);
         case SURVEY -> new SurveyStrategy(questionReqDto);
         case TEXT_RESPONSE -> new TextStrategy(questionReqDto);
         case VIDEO_RESPONSE -> new VideoStrategy(questionReqDto);
         case FILE_RESPONSE -> new FileStrategy(questionReqDto);
      };
   }
}
