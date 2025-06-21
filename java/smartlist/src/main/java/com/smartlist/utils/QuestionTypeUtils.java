package com.smartlist.utils;

import com.smartlist.enums.QuestionType;

public class QuestionTypeUtils {

    private QuestionTypeUtils(){}

    public static boolean isMCQType(QuestionType questionType) {
        return (
                questionType == QuestionType.SCORED_MCQ_SINGLE ||
                        questionType == QuestionType.SCORED_MCQ_MULTIPLE ||
                        questionType == QuestionType.SCORED_MCQ_SINGLE_WEIGHTED_SELECT
        );
    }

    public static boolean isSurveyType(QuestionType questionType) {
        return questionType == QuestionType.SURVEY;
    }

    public static boolean isVideoResponseType(QuestionType questionType) {
        return questionType == QuestionType.VIDEO_RESPONSE;
    }

    public static boolean isTextResponseType(QuestionType questionType) {
        return questionType == QuestionType.TEXT_RESPONSE;
    }

    public static boolean isFileResponseType(QuestionType questionType) {
        return questionType == QuestionType.FILE_RESPONSE;
    }

    public static boolean isAutoScored(QuestionType questionType){
        return QuestionTypeUtils.isSurveyType(questionType) || QuestionTypeUtils.isMCQType(questionType);
    }

    public static boolean isFileCompatibleType(QuestionType questionType) {
        return QuestionTypeUtils.isVideoResponseType(questionType) || QuestionTypeUtils.isFileResponseType(questionType);
    }
}