export enum QuestionType {
  SCORED_MCQ_SINGLE = 'scored_mcq_single',
  SCORED_MCQ_SINGLE_WEIGHTED_SELECT = 'scored_mcq_single_weighted_select',
  SCORED_MCQ_MULTIPLE = 'scored_mcq_multiple',
  SURVEY = 'survey',
  VIDEO_RESPONSE = 'video_response',
  TEXT_RESPONSE = 'text_response',
  FILE_RESPONSE = 'file_response',
}

export class QuestionTypeUtils {
  public static isMCQ(questionType: QuestionType): boolean {
    return (
      questionType == QuestionType.SCORED_MCQ_SINGLE ||
      questionType == QuestionType.SCORED_MCQ_MULTIPLE ||
      questionType == QuestionType.SCORED_MCQ_SINGLE_WEIGHTED_SELECT
    );
  }

  public static isSurvey(questionType: QuestionType): boolean {
    return questionType == QuestionType.SURVEY;
  }

  public static isVideoResponse(questionType: QuestionType): boolean {
    return questionType == QuestionType.VIDEO_RESPONSE;
  }

  public static isTextResponse(questionType: QuestionType): boolean {
    return questionType == QuestionType.TEXT_RESPONSE;
  }

  public static isFileResponse(questionType: QuestionType): boolean {
    return questionType == QuestionType.FILE_RESPONSE;
  }

  public static isAutoScored(questionType: QuestionType): boolean {
    return (
      QuestionTypeUtils.isSurvey(questionType) ||
      QuestionTypeUtils.isMCQ(questionType)
    );
  }

  public static isFile(questionType: QuestionType): boolean {
    return (
      QuestionTypeUtils.isVideoResponse(questionType) ||
      QuestionTypeUtils.isFileResponse(questionType)
    );
  }
}
